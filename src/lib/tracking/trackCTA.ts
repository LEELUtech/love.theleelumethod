"use client";

import {
	getStoredFirstUTM,
	getStoredLastUTM,
	type UTMParams,
} from "@/utils/utm-tracker";
import { getOrCreateSessionId } from "@/lib/tracking/clientTracker";
import { api } from "@/lib/api";

export type TrackCtaOptions = {
	cta_name: string; // e.g. "hero_start_program"
	cta_text?: string | null;
	cta_target_url?: string | null;
	cta_location?: string | null; // e.g. "hero", "footer", "pricing"
};

type CtaEventPayload = {
	event_id: string;
	event_time: string;
	source: "web:client";
	event_name: "cta_clicked";
	funnel_step: "engagement";

	session_id: string;
	salesiq_visitor_id: string | null;

	site: string;
	landing_page: string | null;
	page_path: string;

	utm_first_source: string | null;
	utm_first_medium: string | null;
	utm_first_campaign: string | null;
	utm_first_content: string | null;
	utm_first_term: string | null;

	utm_last_source: string | null;
	utm_last_medium: string | null;
	utm_last_campaign: string | null;
	utm_last_content: string | null;
	utm_last_term: string | null;

	cta_name: string;
	cta_text: string | null;
	cta_target_url: string | null;
	cta_location: string | null;

	email: null;
	intent_token: null;
	payment_intent_id: null;
	scroll_depth: null;
	time_on_page_sec: null;
	chat_opened: null;
};

function hostNoPort(): string {
	return window.location.host.toLowerCase().split(":")[0] || "unknown";
}

function toNull(v?: string | null): string | null {
	const s = (v ?? "").trim();
	return s ? s : null;
}

function utmFirstPayload(utm: UTMParams | null) {
	return {
		utm_first_source: toNull(utm?.utm_source),
		utm_first_medium: toNull(utm?.utm_medium),
		utm_first_campaign: toNull(utm?.utm_campaign),
		utm_first_content: toNull(utm?.utm_content),
		utm_first_term: toNull(utm?.utm_term),
	};
}

function utmLastPayload(utm: UTMParams | null) {
	return {
		utm_last_source: toNull(utm?.utm_source),
		utm_last_medium: toNull(utm?.utm_medium),
		utm_last_campaign: toNull(utm?.utm_campaign),
		utm_last_content: toNull(utm?.utm_content),
		utm_last_term: toNull(utm?.utm_term),
	};
}

// tiny dedup to prevent double click handlers (e.g. bubbling + nested elements)
let lastCtaKey: string | null = null;
let lastCtaTs = 0;

export async function trackCTA(opts: TrackCtaOptions): Promise<void> {
	try {
		const cta_name = toNull(opts.cta_name);
		if (!cta_name) return;

		const session_id = getOrCreateSessionId();
		const now = Date.now();

		const dedupKey = `${session_id}:${window.location.pathname}:cta:${cta_name}`;
		if (lastCtaKey === dedupKey && now - lastCtaTs < 800) return;
		lastCtaKey = dedupKey;
		lastCtaTs = now;

		const salesiq_visitor_id = toNull(
			localStorage.getItem("ff_salesiq_visitor_id"),
		);

		const site = hostNoPort();
		const page_path = window.location.pathname;
		const landing_page = toNull(localStorage.getItem("ff_landing_page"));

		const utm_first = getStoredFirstUTM();
		const utm_last = getStoredLastUTM();

		const payload: CtaEventPayload = {
			event_id: `${session_id}:${now}:cta_clicked:${cta_name}`,
			event_time: new Date().toISOString(),
			source: "web:client",
			event_name: "cta_clicked",
			funnel_step: "engagement",

			session_id,
			salesiq_visitor_id,

			site,
			landing_page,
			page_path,

			...utmFirstPayload(utm_first),
			...utmLastPayload(utm_last),

			cta_name,
			cta_text: toNull(opts.cta_text ?? null),
			cta_target_url: toNull(opts.cta_target_url ?? null),
			cta_location: toNull(opts.cta_location ?? null),

			email: null,
			intent_token: null,
			payment_intent_id: null,
			scroll_depth: null,
			time_on_page_sec: null,
			chat_opened: null,
		};

		await api.post("/api/event-log", payload).catch(() => null);
	} catch {
		// best-effort
	}
}
