import { calculateCompatibility } from "./compatibility-report.service";
import Stripe from "stripe";
import { upsertContactAndUpdateTags } from "../../lib/zoho-campaigns";
import { setCompatState } from "../../lib/zoho-scoring";

const ALL_COMPAT_STATE_TAGS = [
  "cc_battle",
  "cc_truce",
  "cc_victory",
  "cc_revolution",
  "cc_absorption",
] as const;

const CC_EMAIL4_TRIGGER = "cc_email4_trigger";

function mapCompatTag(typeRaw: string): string | null {
  const t = (typeRaw || "").trim().toLowerCase();
  if (t.includes("battle")) return "cc_battle";
  if (t.includes("truce")) return "cc_truce";
  if (t.includes("victory")) return "cc_victory";
  if (t.includes("revolution")) return "cc_revolution";
  if (t.includes("absorption")) return "cc_absorption";
  return null;
}

function mapCompatStateLabel(typeRaw: string): string | null {
  const t = (typeRaw || "").trim().toLowerCase();
  if (t.includes("battle")) return "Battle";
  if (t.includes("truce")) return "Truce";
  if (t.includes("victory")) return "Victory";
  if (t.includes("revolution")) return "Revolution";
  if (t.includes("absorption")) return "Absorption";
  return null;
}

export async function handleCompatibilityReport(pi: Stripe.PaymentIntent) {
  const email = (pi.metadata?.email || pi.receipt_email || "").trim().toLowerCase();
  const birthDate1 = pi.metadata?.birth_date_1 || "";
  const birthDate2 = pi.metadata?.birth_date_2 || "";
  console.log("PI METADATA DEBUG:", {
    emailFromMetadata: pi.metadata?.email,
    receiptEmail: pi.receipt_email,
    birth_date_1: pi.metadata?.birth_date_1,
    birth_date_2: pi.metadata?.birth_date_2,
    fullMetadata: pi.metadata,
  });

  if (!email || !birthDate1 || !birthDate2) {
    throw new Error("Missing required fields for compatibility report");
  }

  console.log("Processing compatibility report for:", email);

  // Вычисляем совместимость
  const compatibility = calculateCompatibility(birthDate1, birthDate2);

  console.log("Compatibility calculated:", {
    type: compatibility.type,
    score: compatibility.diff,
  });

  const stateTag = mapCompatTag(compatibility.type);
  const stateLabel = mapCompatStateLabel(compatibility.type);

  const remove = stateTag
    ? ALL_COMPAT_STATE_TAGS.filter((t) => t !== stateTag)
    : [...ALL_COMPAT_STATE_TAGS];

  // Campaigns: tags + "Compat State" field
  const meta = stateLabel ? { "Compat State": stateLabel } : undefined;
  await upsertContactAndUpdateTags(
    email,
    { add: ["cc_done", ...(stateTag ? [stateTag] : []), CC_EMAIL4_TRIGGER], remove },
    meta,
  );

  // CRM: Compat_State field (best-effort)
  if (stateLabel) {
    try {
      await setCompatState(email, stateLabel);
    } catch (e: unknown) {
      console.error("setCompatState failed (non-critical)", { email, stateLabel, error: e instanceof Error ? e.message : String(e) });
    }
  }

  console.log("Zoho tags + compat state applied:", {
    email,
    stateTag,
    stateLabel,
    compatibilityType: compatibility.type,
  });

  return {
    compatibility_type: compatibility.type,
    compatibility_score: compatibility.diff,
    report_sent: true,
  };
}
