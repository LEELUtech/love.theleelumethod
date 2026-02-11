import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { upsertContactCheckoutStarted } from "@/lib/zoho-functions.sandbox";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

const stripe = getStripe();

type Body = {
  intentId: string;
  intentToken: string;
  productType: string;

  site?: string;

  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;

  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  birthDate1?: string;
  birthDate2?: string;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  checkoutVariant?: string;
  pagePath?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v?: string | null) {
  const s = (v ?? "").trim();
  return s ? s : undefined;
}

function normalizeSite(raw?: string | null): string {
  const s = (raw || "").trim();
  if (!s) return "unknown";

  try {
    if (s.startsWith("http://") || s.startsWith("https://")) {
      const host = new URL(s).host.toLowerCase();
      return host.split(":")[0];
    }
  } catch {}

  const host = s.replace(/\/+$/, "").toLowerCase();
  return host.split(":")[0];
}

function getIncomingSite(req: Request): string {
  const raw =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    process.env.DOMAIN_URL ||
    "unknown";

  return normalizeSite(raw);
}

function safeTokenPreview(token?: string | null) {
  const t = (token || "").toString();
  if (!t) return "";
  if (t.length <= 10) return "***";
  return `${t.slice(0, 6)}…${t.slice(-4)}`;
}

type AxiosishError = {
  response?: {
    status?: number;
    data?: unknown;
    headers?: Record<string, unknown>;
  };
  config?: {
    url?: string;
    method?: string;
  };
  message?: string;
};

function errToLogObject(e: unknown) {
  const ex = e as AxiosishError | null | undefined;
  const status = ex?.response?.status;
  const data = ex?.response?.data;
  const headers = ex?.response?.headers;

  return {
    status,
    data,
    zohoRequestId:
      (headers?.["x-request-id"] as string | undefined) ??
      (headers?.["X-Request-Id"] as string | undefined),
    url: ex?.config?.url,
    method: ex?.config?.method,
    message: ex?.message,
  };
}

// ---- funnel step protection (no rollback) ----
const STEP_RANK: Record<string, number> = {
  unknown: 0,
  checkout_viewed: 1,
  lead_captured: 2,
  checkout_started: 3,
  paid: 4,
  delivered: 5,
  failed: 5,
  canceled: 5,
  abandoned: 5,
};

function shouldAdvance(current?: string | null, next?: string) {
  const c = STEP_RANK[(current || "unknown").toString()] ?? 0;
  const n = STEP_RANK[(next || "unknown").toString()] ?? 0;
  return n >= c;
}

// ✅ patch-only setter (no undefined overwrites)
function patchSet(target: Record<string, unknown>, key: string, value?: unknown) {
  if (value === undefined) return;
  target[key] = value;
}

// --------------------
// 🔥 NON-DEGRADING helpers (Firestore)
// --------------------
function norm(v: unknown) {
  return String(v ?? "").trim();
}

function digitsCount(v: unknown) {
  const s = norm(v);
  const m = s.match(/\d/g);
  return m ? m.length : 0;
}

function isPlaceholderName(v: unknown) {
  const s = norm(v).toLowerCase();
  return !s || s === "unknown" || s === "lead" || s === "customer";
}

/**
 * Text fields: обновляем только если:
 * - текущего нет, или
 * - новое "не хуже": длина >= текущей
 */
function patchSetIfBetterText(
  patch: Record<string, unknown>,
  key: string,
  currentValue: unknown,
  incoming?: string,
) {
  const next = clean(incoming);
  if (next === undefined) return;

  const cur = norm(currentValue);
  const nxt = norm(next);

  if (!nxt) return;

  if (!cur) {
    patch[key] = nxt;
    return;
  }

  if (nxt.length >= cur.length) patch[key] = nxt;
}

/**
 * Names: заполняем если пусто/заглушка, или если новое явно "лучше" (длиннее).
 */
function patchSetIfBetterName(
  patch: Record<string, unknown>,
  key: string,
  currentValue: unknown,
  incoming?: string,
) {
  const next = clean(incoming);
  if (next === undefined) return;

  const cur = norm(currentValue);
  const nxt = norm(next);
  if (!nxt) return;

  if (!cur || isPlaceholderName(cur)) {
    patch[key] = nxt;
    return;
  }

  // если уже нормальное имя — обновляем только если стало длиннее (обычно полнее)
  if (nxt.length > cur.length) patch[key] = nxt;
}

/**
 * Phone: не перетирать на номер с меньшим количеством цифр.
 */
function patchSetIfBetterPhone(
  patch: Record<string, unknown>,
  key: string,
  currentValue: unknown,
  incoming?: string,
) {
  const next = clean(incoming);
  if (next === undefined) return;

  const cur = norm(currentValue);
  const nxt = norm(next);

  if (!nxt) return;

  if (!cur) {
    patch[key] = nxt;
    return;
  }

  const curDigits = digitsCount(cur);
  const nxtDigits = digitsCount(nxt);

  if (nxtDigits < curDigits) return;

  // если цифр больше — точно лучше; если столько же — пусть будет длиннее/полнее
  if (nxtDigits > curDigits || nxt.length >= cur.length) patch[key] = nxt;
}

// --------------------
// Firestore write (non-degrading)
// --------------------
async function markCheckoutStartedInFirestore(intentId: string, patchIncoming: Record<string, unknown>) {
  try {
    const paymentRef = doc(db, "payments", intentId);
    const snap = await getDoc(paymentRef);

    const existing = snap.exists() ? (snap.data() as Record<string, unknown>) : {};
    const currentStep = (existing["funnel_step"] as string | undefined) ?? undefined;

    const canAdvance = shouldAdvance(currentStep, "checkout_started");

    // ✅ ВАЖНО: не делаем `{...patchIncoming}` целиком,
    // иначе "хуже" значения попадут в патч и перетрут.
    const guardedKeys = new Set([
      "first_name",
      "last_name",
      "phone",
      "address1",
      "address2",
      "city",
      "state",
      "postal_code",
      "country",
    ]);

    const patch: Record<string, unknown> = {};

    // копируем только безопасные ключи (не guarded)
    for (const [k, v] of Object.entries(patchIncoming || {})) {
      if (guardedKeys.has(k)) continue;
      if (v === undefined) continue;
      patch[k] = v;
    }

    // funnel + timestamps
    if (canAdvance) {
      patch.funnel_step = "checkout_started";
      patch.checkout_started_at = serverTimestamp();
    }
    patch.processed_at = serverTimestamp();
    patch.updated_at = serverTimestamp();

    // ✅ non-degrading для guarded полей
    if ("first_name" in patchIncoming) {
      patchSetIfBetterName(
        patch,
        "first_name",
        existing["first_name"],
        (patchIncoming as Record<string, unknown>)["first_name"] as string | undefined,
      );
    }
    if ("last_name" in patchIncoming) {
      patchSetIfBetterName(
        patch,
        "last_name",
        existing["last_name"],
        (patchIncoming as Record<string, unknown>)["last_name"] as string | undefined,
      );
    }

    if ("phone" in patchIncoming) {
      patchSetIfBetterPhone(
        patch,
        "phone",
        existing["phone"],
        (patchIncoming as Record<string, unknown>)["phone"] as string | undefined,
      );
    }

    if ("address1" in patchIncoming) {
      patchSetIfBetterText(
        patch,
        "address1",
        existing["address1"],
        (patchIncoming as Record<string, unknown>)["address1"] as string | undefined,
      );
    }
    if ("address2" in patchIncoming) {
      patchSetIfBetterText(
        patch,
        "address2",
        existing["address2"],
        (patchIncoming as Record<string, unknown>)["address2"] as string | undefined,
      );
    }

    if ("city" in patchIncoming) {
      patchSetIfBetterText(
        patch,
        "city",
        existing["city"],
        (patchIncoming as Record<string, unknown>)["city"] as string | undefined,
      );
    }
    if ("state" in patchIncoming) {
      patchSetIfBetterText(
        patch,
        "state",
        existing["state"],
        (patchIncoming as Record<string, unknown>)["state"] as string | undefined,
      );
    }
    if ("postal_code" in patchIncoming) {
      patchSetIfBetterText(
        patch,
        "postal_code",
        existing["postal_code"],
        (patchIncoming as Record<string, unknown>)["postal_code"] as string | undefined,
      );
    }

    if ("country" in patchIncoming) {
      patchSetIfBetterText(
        patch,
        "country",
        existing["country"],
        (patchIncoming as Record<string, unknown>)["country"] as string | undefined,
      );
    }

    await setDoc(paymentRef, patch, { merge: true });
  } catch (e) {
    console.error("⚠️ Firestore checkout_started write failed", { intentId, e });
  }
}

function buildMetadata(body: Body, pi: Stripe.PaymentIntent, siteFinal: string) {
  // merge existing metadata (keeps intent_token + old keys)
  const metadata: Record<string, string> = {
    ...(pi.metadata as Record<string, string>),

    product_type: (pi.metadata?.product_type?.toString() || body.productType).trim(),
    email: body.email.trim().toLowerCase(),
    site: siteFinal,
    updated_at: new Date().toISOString(),
  };

  const firstName = clean(body.firstName);
  const lastName = clean(body.lastName);
  const fullName = clean([firstName, lastName].filter(Boolean).join(" "));
  if (fullName) metadata.name = fullName;

  const phone = clean(body.phone);
  if (phone) metadata.phone = phone;

  const address1 = clean(body.address1);
  const address2 = clean(body.address2);
  const city = clean(body.city);
  const state = clean(body.state);
  const postalCode = clean(body.postalCode);
  const country = clean(body.country)?.toUpperCase();

  if (address1) metadata.address_line1 = address1;
  if (address2) metadata.address_line2 = address2;
  if (city) metadata.city = city;
  if (state) metadata.state = state;
  if (postalCode) metadata.postal_code = postalCode;
  if (country) metadata.country = country;

  if (metadata.product_type === "compatibility_report") {
    const bd1 = clean(body.birthDate1);
    const bd2 = clean(body.birthDate2);
    if (!bd1 || !bd2) throw new Error("Missing birth dates for compatibility report");
    metadata.birth_date_1 = bd1;
    metadata.birth_date_2 = bd2;
  }

  const utmSource = clean(body.utmSource);
  const utmMedium = clean(body.utmMedium);
  const utmCampaign = clean(body.utmCampaign);
  const utmContent = clean(body.utmContent);
  const utmTerm = clean(body.utmTerm);

  if (utmSource) metadata.utm_source = utmSource;
  if (utmMedium) metadata.utm_medium = utmMedium;
  if (utmCampaign) metadata.utm_campaign = utmCampaign;
  if (utmContent) metadata.utm_content = utmContent;
  if (utmTerm) metadata.utm_term = utmTerm;

  const checkoutVariant = clean(body.checkoutVariant);
  const pagePath = clean(body.pagePath);

  if (checkoutVariant) metadata.checkout_variant = checkoutVariant;
  if (pagePath) metadata.page_path = pagePath;

  return metadata;
}

/**
 * ✅ Ensure Stripe Customer exists and attached to PI
 */
async function ensureCustomerForIntent(opts: {
  pi: Stripe.PaymentIntent;
  email: string;
  siteFinal: string;
  body: Body;
}): Promise<string | undefined> {
  const { pi, email, siteFinal, body } = opts;

  if (pi.customer) return String(pi.customer);

  const fullName = clean([clean(body.firstName), clean(body.lastName)].filter(Boolean).join(" "));
  const phone = clean(body.phone);

  const address = {
    line1: clean(body.address1),
    line2: clean(body.address2),
    city: clean(body.city),
    state: clean(body.state),
    postal_code: clean(body.postalCode),
    country: clean(body.country)?.toUpperCase(),
  };

  const addressClean: Stripe.AddressParam = Object.fromEntries(
    Object.entries(address).filter(([, v]) => !!v),
  ) as Stripe.AddressParam;

  const customer = await stripe.customers.create(
    {
      email,
      ...(fullName ? { name: fullName } : {}),
      ...(phone ? { phone } : {}),
      ...(Object.keys(addressClean).length ? { address: addressClean } : {}),
      metadata: {
        source: "checkout_update_intent",
        intent_id: pi.id,
        site: siteFinal,
      },
    },
    { idempotencyKey: `cust_${pi.id}` },
  );

  await stripe.paymentIntents.update(pi.id, { customer: customer.id });

  return customer.id;
}

export async function POST(req: NextRequest) {
  const requestId = `upi_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const body = (await req.json()) as Body;

    const incomingSite = getIncomingSite(req);
    const bodySite = normalizeSite(body.site) || "unknown";

    const intentId = clean(body.intentId);
    const intentToken = clean(body.intentToken);
    const productType = clean(body.productType);
    const email = clean(body.email)?.toLowerCase();

    console.log("➡️ update-payment-intent START", {
      requestId,
      incomingSite,
      bodySite,
      intentId,
      productType,
      email,
      intentTokenPreview: safeTokenPreview(intentToken),
    });

    if (!intentId) return NextResponse.json({ error: "Missing intentId", requestId }, { status: 400 });
    if (!intentToken) return NextResponse.json({ error: "Missing intentToken", requestId }, { status: 400 });
    if (!productType) return NextResponse.json({ error: "Missing productType", requestId }, { status: 400 });

    if (!email) return NextResponse.json({ error: "Email is required", requestId }, { status: 400 });
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format", requestId }, { status: 400 });
    }

    const pi = await stripe.paymentIntents.retrieve(intentId);

    if (pi.status === "canceled") {
      await markCheckoutStartedInFirestore(pi.id, {
        stripe_payment_intent_id: pi.id,
        email,
        product_type: (pi.metadata?.product_type ?? productType)?.toString() || productType,
        site: normalizeSite((pi.metadata?.site ?? "").toString()) || incomingSite,
        status: pi.status,
        metadata: (pi.metadata as Record<string, string>) ?? {},
        customer_id: pi.customer ? String(pi.customer) : null,
      });

      return NextResponse.json({ ok: true, requestId, canceled: true }, { status: 200 });
    }

    const storedToken = (pi.metadata?.intent_token ?? "").toString();
    if (!storedToken || storedToken !== intentToken) {
      console.warn("⛔ Forbidden: intent token mismatch", {
        requestId,
        intentId,
        storedTokenPreview: safeTokenPreview(storedToken),
        incomingTokenPreview: safeTokenPreview(intentToken),
      });
      return NextResponse.json({ error: "Forbidden", requestId }, { status: 403 });
    }

    const storedSiteRaw = (pi.metadata?.site ?? "").toString();
    const storedSite = normalizeSite(storedSiteRaw);

    const anyIncoming = incomingSite !== "unknown" ? incomingSite : bodySite;
    if (storedSite && storedSite !== "unknown" && anyIncoming !== "unknown" && storedSite !== anyIncoming) {
      console.warn("⛔ Forbidden: site mismatch", {
        requestId,
        intentId,
        storedSiteRaw,
        storedSite,
        incomingSite,
        bodySite,
      });
      return NextResponse.json({ error: "Forbidden", requestId }, { status: 403 });
    }

    const existingType = (pi.metadata?.product_type ?? "").toString();
    if (existingType && existingType !== productType) {
      return NextResponse.json(
        { error: `productType mismatch (expected ${existingType}, got ${productType})`, requestId },
        { status: 400 },
      );
    }

    const siteFinal =
      storedSite !== "unknown"
        ? storedSite
        : incomingSite !== "unknown"
          ? incomingSite
          : bodySite !== "unknown"
            ? bodySite
            : "unknown";

    let customerId: string | undefined;
    try {
      customerId = await ensureCustomerForIntent({ pi, email, siteFinal, body });
    } catch (e) {
      console.error("⚠️ ensureCustomerForIntent failed (non-fatal)", { requestId, intentId, e });
      customerId = pi.customer ? String(pi.customer) : undefined;
    }

    // ✅ если уже succeeded — Stripe PI не трогаем, но Firestore/Zoho можем дозаполнить (non-degrading)
    if (pi.status === "succeeded") {
      let zoho: { contactId: string; isNew: boolean } | null = null;

      try {
        zoho = await upsertContactCheckoutStarted({
          email,
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,

          address1: body.address1,
          address2: body.address2,
          city: body.city,
          state: body.state,
          postalCode: body.postalCode,
          country: body.country,

          productType: existingType || productType,
          checkoutVariant: body.checkoutVariant,
          pagePath: body.pagePath,
          site: siteFinal,

          utmSource: body.utmSource,
          utmMedium: body.utmMedium,
          utmCampaign: body.utmCampaign,
          utmContent: body.utmContent,
          utmTerm: body.utmTerm,

          stripePaymentIntentId: pi.id,
        });
      } catch (e: unknown) {
        console.error("⚠️ Zoho checkout-started upsert failed (pi already succeeded)", {
          requestId,
          ...errToLogObject(e),
        });
      }

      const patch: Record<string, unknown> = {
        stripe_payment_intent_id: pi.id,
        email,
        product_type: existingType || productType,
        site: siteFinal,
        status: pi.status,
        metadata: (pi.metadata as Record<string, string>) ?? {},
        customer_id: customerId ?? (pi.customer ? String(pi.customer) : null),
      };

      patchSet(patch, "page_path", clean(body.pagePath));
      patchSet(patch, "checkout_variant", clean(body.checkoutVariant));

      patchSet(patch, "utm_source", clean(body.utmSource));
      patchSet(patch, "utm_medium", clean(body.utmMedium));
      patchSet(patch, "utm_campaign", clean(body.utmCampaign));
      patchSet(patch, "utm_content", clean(body.utmContent));
      patchSet(patch, "utm_term", clean(body.utmTerm));

      // guarded поля — попадут в markCheckoutStartedInFirestore и будут non-degrading
      patchSet(patch, "first_name", clean(body.firstName));
      patchSet(patch, "last_name", clean(body.lastName));
      patchSet(patch, "phone", clean(body.phone));
      patchSet(patch, "address1", clean(body.address1));
      patchSet(patch, "address2", clean(body.address2));
      patchSet(patch, "city", clean(body.city));
      patchSet(patch, "state", clean(body.state));
      patchSet(patch, "postal_code", clean(body.postalCode));
      patchSet(patch, "country", clean(body.country)?.toUpperCase());

      await markCheckoutStartedInFirestore(pi.id, patch);

      return NextResponse.json(
        { ok: true, requestId, intentId: pi.id, site: siteFinal, alreadySucceeded: true, zoho, customerId },
        { status: 200 },
      );
    }

    // build metadata (merge)
    let metadata: Record<string, string>;
    try {
      metadata = buildMetadata({ ...body, email, productType: existingType || productType }, pi, siteFinal);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : undefined;
      return NextResponse.json({ error: msg || "Invalid payload", requestId }, { status: 400 });
    }

    if (customerId) metadata.stripe_customer_id = customerId;

    const updatedIntent = await stripe.paymentIntents.update(intentId, {
      receipt_email: email,
      metadata,
    });

    const patch: Record<string, unknown> = {
      stripe_payment_intent_id: updatedIntent.id,
      email,
      product_type: existingType || productType,
      site: siteFinal,
      status: updatedIntent.status,
      metadata: (updatedIntent.metadata as Record<string, string>) ?? {},
      customer_id: customerId ?? (updatedIntent.customer ? String(updatedIntent.customer) : null),
    };

    patchSet(patch, "page_path", clean(body.pagePath));
    patchSet(patch, "checkout_variant", clean(body.checkoutVariant));

    patchSet(patch, "utm_source", clean(body.utmSource));
    patchSet(patch, "utm_medium", clean(body.utmMedium));
    patchSet(patch, "utm_campaign", clean(body.utmCampaign));
    patchSet(patch, "utm_content", clean(body.utmContent));
    patchSet(patch, "utm_term", clean(body.utmTerm));

    // guarded поля — non-degrading внутри markCheckoutStartedInFirestore
    patchSet(patch, "first_name", clean(body.firstName));
    patchSet(patch, "last_name", clean(body.lastName));
    patchSet(patch, "phone", clean(body.phone));
    patchSet(patch, "address1", clean(body.address1));
    patchSet(patch, "address2", clean(body.address2));
    patchSet(patch, "city", clean(body.city));
    patchSet(patch, "state", clean(body.state));
    patchSet(patch, "postal_code", clean(body.postalCode));
    patchSet(patch, "country", clean(body.country)?.toUpperCase());

    await markCheckoutStartedInFirestore(updatedIntent.id, patch);

    // Zoho: checkout_started (у тебя уже должно быть non-degrading на стороне Zoho функций)
    let zoho: { contactId: string; isNew: boolean } | null = null;
    try {
      zoho = await upsertContactCheckoutStarted({
        email,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,

        address1: body.address1,
        address2: body.address2,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country,

        productType: existingType || productType,
        checkoutVariant: body.checkoutVariant,
        pagePath: body.pagePath,
        site: siteFinal,

        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
        utmContent: body.utmContent,
        utmTerm: body.utmTerm,

        stripePaymentIntentId: updatedIntent.id,
      });
    } catch (e: unknown) {
      console.error("⚠️ Zoho checkout-started upsert failed", { requestId, ...errToLogObject(e) });
    }

    return NextResponse.json({
      ok: true,
      requestId,
      intentId: updatedIntent.id,
      site: siteFinal,
      customerId: customerId ?? (updatedIntent.customer ? String(updatedIntent.customer) : null),
      zoho,
    });
  } catch (err: unknown) {
    console.error("❌ Error updating payment intent:", { err });

    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: err.message || "Stripe error" }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to update payment intent" }, { status: 500 });
  }
}
