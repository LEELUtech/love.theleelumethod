"use client";

import { api } from "@/lib/api";
import { getOrCreateSessionId } from "@/lib/tracking/clientTracker";
import {
	getStoredFirstUTM,
	getStoredLastUTM,
	type UTMParams,
} from "@/utils/utm-tracker";

type Options = {
	stallAfterSec?: number;
	debug?: boolean;
	maxAgeSec?: number; // default 1800 (30 min)
};

type StallPayload = {
	event_id: string;
	event_time: string;
	source: "web:client";
	event_name: "checkout_stalled";

	session_id: string;
	salesiq_visitor_id: string | null;
	site: string;
	landing_page: string | null;
	page_path: string;

	payment_intent_id: string;
	intent_token: string;

	abandon_reason: "timeout";
	time_on_page_sec: number;

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

	email: null;
	scroll_depth: null;
	chat_opened: null;
};

function hostNoPort(): string {
	return window.location.host.toLowerCase().split(":")[0] || "unknown";
}

function toNull(v: string | null | undefined): string | null {
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

function clearCheckoutContext(): void {
	try {
		localStorage.removeItem("ff_last_intent_id");
		localStorage.removeItem("ff_last_intent_token");
		localStorage.removeItem("ff_last_checkout_viewed_at");
		localStorage.removeItem("ff_checkout_started");
		localStorage.removeItem("ff_checkout_stalled");
	} catch {
		// ignore
	}
}

export function startCheckoutStallTracker(opts?: Options): () => void {
	const stallAfterSec = opts?.stallAfterSec ?? 180;
	const maxAgeSec = opts?.maxAgeSec ?? 1800; // 30 min
	const debug = opts?.debug ?? false;

	const intentId = toNull(localStorage.getItem("ff_last_intent_id"));
	const intentToken = toNull(localStorage.getItem("ff_last_intent_token"));
	const viewedAtRaw = toNull(
		localStorage.getItem("ff_last_checkout_viewed_at"),
	);

	if (!intentId || !intentToken || !viewedAtRaw) return () => {};

	const viewedAt = Number(viewedAtRaw);
	if (!Number.isFinite(viewedAt)) return () => {};

	const ageSec = Math.max(0, Math.round((Date.now() - viewedAt) / 1000));
	if (ageSec > maxAgeSec) {
		clearCheckoutContext();
		return () => {};
	}

	const alreadyStalled = localStorage.getItem("ff_checkout_stalled") === "1";
	if (alreadyStalled) return () => {};

	const timer = window.setTimeout(() => {
		void (async () => {
			try {
				const started = localStorage.getItem("ff_checkout_started") === "1";
				if (started) return;

				const session_id = getOrCreateSessionId();
				const salesiq_visitor_id = toNull(
					localStorage.getItem("ff_salesiq_visitor_id"),
				);
				const landing_page = toNull(localStorage.getItem("ff_landing_page"));

				const site = hostNoPort();
				const page_path = window.location.pathname;

				const utm_first = getStoredFirstUTM();
				const utm_last = getStoredLastUTM();

				const secondsSinceViewed = Math.max(
					0,
					Math.round((Date.now() - viewedAt) / 1000),
				);

				const payload: StallPayload = {
					event_id: `${session_id}:${Date.now()}:checkout_stalled`,
					event_time: new Date().toISOString(),
					source: "web:client",
					event_name: "checkout_stalled",

					session_id,
					salesiq_visitor_id,
					site,
					landing_page,
					page_path,

					payment_intent_id: intentId,
					intent_token: intentToken,

					abandon_reason: "timeout",
					time_on_page_sec: secondsSinceViewed,

					...utmFirstPayload(utm_first),
					...utmLastPayload(utm_last),

					email: null,
					scroll_depth: null,
					chat_opened: null,
				};

				if (debug) {
					// eslint-disable-next-line no-console
					console.log("[checkoutStallTracker] emit", payload);
				}

				await api.post("/api/event-log", payload).catch(() => null);

				try {
					localStorage.setItem("ff_checkout_stalled", "1");
				} catch {
					// ignore
				}
			} catch {
				// best-effort
			}
		})();
	}, stallAfterSec * 1000);

	return () => window.clearTimeout(timer);
}
