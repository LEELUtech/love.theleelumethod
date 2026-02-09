/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/zoho-functions.sandbox.ts
import { zohoRequest } from "@/lib/zoho-client.sandbox";

type UTM = {
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmContent?: string;
	utmTerm?: string;
};

export type UpsertResult = { contactId: string; isNew: boolean };

function cleanStr(v?: string | null) {
	const s = (v ?? "").trim();
	return s ? s : undefined;
}

function guessLeadSource(utmSource?: string) {
	const s = (utmSource || "").toLowerCase();
	if (s.includes("instagram")) return "Instagram";
	if (s.includes("tiktok")) return "TikTok";
	if (s.includes("facebook")) return "Facebook";
	if (s.includes("youtube")) return "YouTube";
	if (s.includes("google")) return "Google";
	return undefined;
}

/** ставим поле ТОЛЬКО если в CRM оно пустое */
function setIfEmpty(
	obj: Record<string, any>,
	key: string,
	current: any,
	next?: any,
) {
	const val = typeof next === "string" ? cleanStr(next) : next;
	if (val === undefined || val === null) return;
	if (!current) obj[key] = val;
}

function isPlaceholderName(v: any) {
	const s = String(v ?? "")
		.trim()
		.toLowerCase();
	return !s || s === "unknown" || s === "lead" || s === "customer";
}

function setIfEmptyOrPlaceholder(
	obj: Record<string, any>,
	key: string,
	current: any,
	next?: any,
) {
	const val = typeof next === "string" ? cleanStr(next) : next;
	if (val === undefined || val === null) return;

	// ✅ пишем если пусто ИЛИ если там заглушка типа "Unknown"
	if (!current || isPlaceholderName(current)) obj[key] = val;
}

/** аккуратно добавляем строку в Description, не раздувая > 3000 */
function appendDescription(existingDesc: string | undefined, line: string) {
	const l = cleanStr(line);
	if (!l) return undefined;

	const base = cleanStr(existingDesc) || "";
	const next = base ? `${base}\n${l}` : l;

	const LIMIT = 3000;
	if (next.length <= LIMIT) return next;

	return next.slice(next.length - LIMIT);
}

async function findContactByEmail(email: string): Promise<any | null> {
	const criteria = encodeURIComponent(`(Email:equals:${email})`);
	const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts/search?criteria=${criteria}`;

	try {
		const search = await zohoRequest({ method: "GET", url });
		return search?.data?.[0] ?? null;
	} catch (e: any) {
		const status = e?.response?.status;
		// Zoho часто отвечает 204 "No Content" если ничего не найдено
		if (status === 204 || status === 404) return null;
		throw e;
	}
}

function buildCheckoutStartedLine(input: {
	productType: string;
	checkoutVariant?: string;
	pagePath?: string;
	site?: string;
	stripePaymentIntentId?: string;
}) {
	const parts = [
		"Checkout started",
		`product=${input.productType}`,
		input.checkoutVariant ? `variant=${input.checkoutVariant}` : null,
		input.pagePath ? `page=${input.pagePath}` : null,
		input.site ? `site=${input.site}` : null,
		input.stripePaymentIntentId ? `pi=${input.stripePaymentIntentId}` : null,
	].filter(Boolean);

	return parts.join(" | ");
}

/** ключ для дедупа checkout-started (стабильный, без PI) */
function buildCheckoutStartedDedupeKey(input: {
	productType: string;
	checkoutVariant?: string;
	pagePath?: string;
}) {
	const parts = [
		"Checkout started",
		`product=${input.productType}`,
		input.checkoutVariant ? `variant=${input.checkoutVariant}` : null,
		input.pagePath ? `page=${input.pagePath}` : null,
	].filter(Boolean);

	return parts.join(" | ");
}

/**
 * ✅ ЭТАП 1 — Lead Captured (onBlur)
 * - Создаёт Contact если его нет
 * - Заполняет только first-touch поля (UTM + Landing Page + Site + Lead Source)
 * - НЕ ПИШЕТ Description
 * - НЕ трогает имя/телефон
 */
export async function upsertContactLeadCaptured(
	input: {
		email: string;
		site?: string;
		pagePath?: string;
	} & UTM,
): Promise<UpsertResult> {
	const email = cleanStr(input.email)?.toLowerCase();
	if (!email) throw new Error("Email is required");

	const existing = await findContactByEmail(email);
	const leadSource = guessLeadSource(input.utmSource);

	// UPDATE EXISTING
	if (existing?.id) {
		const updateData: Record<string, any> = { id: existing.id };

		// first-touch attribution (only if empty)
		setIfEmpty(
			updateData,
			"First_UTM_Source",
			existing.First_UTM_Source,
			input.utmSource,
		);
		setIfEmpty(
			updateData,
			"First_UTM_Medium",
			existing.First_UTM_Medium,
			input.utmMedium,
		);
		setIfEmpty(
			updateData,
			"First_UTM_Campaign",
			existing.First_UTM_Campaign,
			input.utmCampaign,
		);
		setIfEmpty(
			updateData,
			"First_UTM_Content",
			existing.First_UTM_Content,
			input.utmContent,
		);
		setIfEmpty(
			updateData,
			"First_UTM_Term",
			existing.First_UTM_Term,
			input.utmTerm,
		);
		setIfEmpty(
			updateData,
			"First_Landing_Page",
			existing.First_Landing_Page,
			input.pagePath,
		);

		// site + lead source (only if empty)
		setIfEmpty(updateData, "Site", existing.Site, input.site);
		setIfEmpty(updateData, "Lead_Source", existing.Lead_Source, leadSource);

		// ничего обновлять — не делаем PUT
		if (Object.keys(updateData).length === 1) {
			return { contactId: existing.id, isNew: false };
		}

		const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts`;
		await zohoRequest({ method: "PUT", url, data: { data: [updateData] } });

		return { contactId: existing.id, isNew: false };
	}

	// CREATE NEW
	const createData: Record<string, any> = {
		Email: email,
		// Zoho часто требует имена
		First_Name: "Unknown",
		Last_Name: "Lead",
	};

	if (leadSource) createData.Lead_Source = leadSource;

	if (cleanStr(input.utmSource))
		createData.First_UTM_Source = input.utmSource!.trim();
	if (cleanStr(input.utmMedium))
		createData.First_UTM_Medium = input.utmMedium!.trim();
	if (cleanStr(input.utmCampaign))
		createData.First_UTM_Campaign = input.utmCampaign!.trim();
	if (cleanStr(input.utmContent))
		createData.First_UTM_Content = input.utmContent!.trim();
	if (cleanStr(input.utmTerm))
		createData.First_UTM_Term = input.utmTerm!.trim();

	if (cleanStr(input.pagePath))
		createData.First_Landing_Page = input.pagePath!.trim();
	if (cleanStr(input.site)) createData.Site = input.site!.trim();

	const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts`;
	const created = await zohoRequest({
		method: "POST",
		url,
		data: { data: [createData] },
	});

	const newId = created?.data?.[0]?.details?.id;
	if (!newId)
		throw new Error(`Zoho create failed: missing id (check Zoho response)`);

	return { contactId: newId, isNew: true };
}

/**
 * ✅ ЭТАП 2 — Checkout Started (кнопка Pay)
 * - Дополняем контакт (имя/телефон) ТОЛЬКО если пусто
 * - First-touch поля — тоже только если пусто
 * - Stripe_Payment_Intent_ID — можно обновлять всегда (безопасно)
 * - Пишем лог в Description (append), но без дублей
 */
export async function upsertContactCheckoutStarted(
	input: {
		email: string;
		firstName?: string;
		lastName?: string;
		phone?: string;

		productType: string;
		checkoutVariant?: string;
		pagePath?: string;
		site?: string;

		stripePaymentIntentId?: string;
	} & UTM,
): Promise<UpsertResult> {
	const email = cleanStr(input.email)?.toLowerCase();
	if (!email) throw new Error("Email is required");

	const existing = await findContactByEmail(email);
	const leadSource = guessLeadSource(input.utmSource);

	// UPDATE EXISTING
	if (existing?.id) {
		const updateData: Record<string, any> = { id: existing.id };

		// basics (only if empty)
		setIfEmptyOrPlaceholder(
			updateData,
			"First_Name",
			existing.First_Name,
			input.firstName,
		);
		setIfEmptyOrPlaceholder(
			updateData,
			"Last_Name",
			existing.Last_Name,
			input.lastName,
		);
		setIfEmpty(updateData, "Phone", existing.Phone, input.phone);

		// first-touch (only if empty)
		setIfEmpty(
			updateData,
			"First_UTM_Source",
			existing.First_UTM_Source,
			input.utmSource,
		);
		setIfEmpty(
			updateData,
			"First_UTM_Medium",
			existing.First_UTM_Medium,
			input.utmMedium,
		);
		setIfEmpty(
			updateData,
			"First_UTM_Campaign",
			existing.First_UTM_Campaign,
			input.utmCampaign,
		);
		setIfEmpty(
			updateData,
			"First_UTM_Content",
			existing.First_UTM_Content,
			input.utmContent,
		);
		setIfEmpty(
			updateData,
			"First_UTM_Term",
			existing.First_UTM_Term,
			input.utmTerm,
		);
		setIfEmpty(
			updateData,
			"First_Landing_Page",
			existing.First_Landing_Page,
			input.pagePath,
		);

		setIfEmpty(updateData, "Site", existing.Site, input.site);
		setIfEmpty(updateData, "Lead_Source", existing.Lead_Source, leadSource);

		// safe to always store latest PI if provided
		if (cleanStr(input.stripePaymentIntentId)) {
			updateData.Stripe_Payment_Intent_ID = input.stripePaymentIntentId!.trim();
		}

		// log step (append, без дублей)
		const eventLine = buildCheckoutStartedLine({
			productType: input.productType,
			checkoutVariant: input.checkoutVariant,
			pagePath: input.pagePath,
			site: input.site,
			stripePaymentIntentId: input.stripePaymentIntentId,
		});

		const dedupeKey = buildCheckoutStartedDedupeKey({
			productType: input.productType,
			checkoutVariant: input.checkoutVariant,
			pagePath: input.pagePath,
		});

		if (!existing.Description?.includes(dedupeKey)) {
			const nextDesc = appendDescription(existing.Description, eventLine);
			if (nextDesc && nextDesc !== existing.Description) {
				updateData.Description = nextDesc;
			}
		}

		// ✅ ничего обновлять — не делаем PUT
		if (Object.keys(updateData).length === 1) {
			return { contactId: existing.id, isNew: false };
		}

		const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts`;
		await zohoRequest({ method: "PUT", url, data: { data: [updateData] } });

		return { contactId: existing.id, isNew: false };
	}

	// CREATE NEW
	const createData: Record<string, any> = {
		Email: email,
		First_Name: cleanStr(input.firstName) || "Unknown",
		Last_Name: cleanStr(input.lastName) || "Customer",
	};

	if (cleanStr(input.phone)) createData.Phone = input.phone!.trim();
	if (leadSource) createData.Lead_Source = leadSource;

	if (cleanStr(input.utmSource))
		createData.First_UTM_Source = input.utmSource!.trim();
	if (cleanStr(input.utmMedium))
		createData.First_UTM_Medium = input.utmMedium!.trim();
	if (cleanStr(input.utmCampaign))
		createData.First_UTM_Campaign = input.utmCampaign!.trim();
	if (cleanStr(input.utmContent))
		createData.First_UTM_Content = input.utmContent!.trim();
	if (cleanStr(input.utmTerm))
		createData.First_UTM_Term = input.utmTerm!.trim();

	if (cleanStr(input.pagePath))
		createData.First_Landing_Page = input.pagePath!.trim();
	if (cleanStr(input.site)) createData.Site = input.site!.trim();

	if (cleanStr(input.stripePaymentIntentId)) {
		createData.Stripe_Payment_Intent_ID = input.stripePaymentIntentId!.trim();
	}

	// ✅ лог на создание
	createData.Description = buildCheckoutStartedLine({
		productType: input.productType,
		checkoutVariant: input.checkoutVariant,
		pagePath: input.pagePath,
		site: input.site,
		stripePaymentIntentId: input.stripePaymentIntentId,
	});

	const url = `https://${process.env.ZOHO_API_DOMAIN_SANDBOX}/crm/v2/Contacts`;
	const created = await zohoRequest({
		method: "POST",
		url,
		data: { data: [createData] },
	});

	const newId = created?.data?.[0]?.details?.id;
	if (!newId)
		throw new Error(`Zoho create failed: missing id (check Zoho response)`);

	return { contactId: newId, isNew: true };
}
