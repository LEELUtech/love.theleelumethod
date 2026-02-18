"use client";

import { api } from "@/lib/api";
import { getOrCreateSessionId } from "@/lib/tracking/clientTracker";
import {
	getStoredFirstUTM,
	getStoredLastUTM,
	type UTMParams,
} from "@/utils/utm-tracker";

type EngagementOptions = {
	debug?: boolean;
	scrollThresholds?: ReadonlyArray<number>; // default: [25, 50, 75, 90]
	timeThresholdsSec?: ReadonlyArray<number>; // default: [10, 30, 60, 120]
};

type Cleanup = () => void;

type ScrollEventName = `scroll_${number}`;
type TimeEventName = `time_${number}s`;
type EngagementEventName = ScrollEventName | TimeEventName | "page_engaged";

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

// 0..100
function getScrollDepthPct(): number {
	const doc = document.documentElement;
	const body = document.body;

	const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
	const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
	const clientHeight = doc.clientHeight || window.innerHeight;

	const maxScroll = Math.max(scrollHeight - clientHeight, 1);
	const pct = Math.round((scrollTop / maxScroll) * 100);
	return Math.min(100, Math.max(0, pct));
}

type BaseEvent = {
	event_id: string;
	event_time: string;
	source: "web:client";

	event_name: string;
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

	email: null;
	intent_token: null;
	payment_intent_id: null;

	scroll_depth?: number | null;
	time_on_page_sec?: number | null;
};

let lastSentKey: string | null = null;
let lastSentTs = 0;

// page_engaged
const PAGE_ENGAGED_PREFIX = "ff_page_engaged:";

function pageEngagedKey(sessionId: string, pagePath: string) {
	return `${PAGE_ENGAGED_PREFIX}${sessionId}:${pagePath}`;
}

function markPageEngagedSent(sessionId: string, pagePath: string) {
	try {
		sessionStorage.setItem(pageEngagedKey(sessionId, pagePath), "1");
	} catch {
		// ignore
	}
}

function wasPageEngagedSent(sessionId: string, pagePath: string) {
	try {
		return sessionStorage.getItem(pageEngagedKey(sessionId, pagePath)) === "1";
	} catch {
		return false;
	}
}

async function postEvent(
	eventName: EngagementEventName,
	extra: Pick<BaseEvent, "scroll_depth" | "time_on_page_sec">,
	debug: boolean,
): Promise<void> {
	const session_id = getOrCreateSessionId();
	const now = Date.now();

	const page_path = window.location.pathname;

	const dedupKey = `${session_id}:${page_path}:${eventName}`;
	if (lastSentKey === dedupKey && now - lastSentTs < 1000) return;
	lastSentKey = dedupKey;
	lastSentTs = now;

	const salesiq_visitor_id = toNull(
		localStorage.getItem("ff_salesiq_visitor_id"),
	);

	const site = hostNoPort();
	const landing_page = toNull(localStorage.getItem("ff_landing_page"));

	const utm_first = getStoredFirstUTM();
	const utm_last = getStoredLastUTM();

	const payload: BaseEvent = {
		event_id: `${session_id}:${now}:${eventName}`,
		event_time: new Date().toISOString(),
		source: "web:client",

		event_name: eventName,
		funnel_step: "engagement",

		session_id,
		salesiq_visitor_id,

		site,
		landing_page,
		page_path,

		...utmFirstPayload(utm_first),
		...utmLastPayload(utm_last),

		email: null,
		intent_token: null,
		payment_intent_id: null,

		scroll_depth: extra.scroll_depth ?? null,
		time_on_page_sec: extra.time_on_page_sec ?? null,
	};

	if (debug) {
		// eslint-disable-next-line no-console
		console.log("[engagementTracker] post", eventName, payload);
	}

	await api.post("/api/event-log", payload).catch(() => null);
}

async function postPageEngagedIfNeeded(
	debug: boolean,
	reason: "time>=10s" | "scroll>=25",
	time_on_page_sec: number,
	scroll_depth: number,
) {
	const session_id = getOrCreateSessionId();
	const page_path = window.location.pathname;

	if (wasPageEngagedSent(session_id, page_path)) return;

	markPageEngagedSent(session_id, page_path);

	if (debug) {
		// eslint-disable-next-line no-console
		console.log("[engagementTracker] page_engaged fired", {
			reason,
			session_id,
			page_path,
		});
	}

	await postEvent("page_engaged", { time_on_page_sec, scroll_depth }, debug);
}

export function startEngagementTracking(opts?: EngagementOptions): Cleanup {
	const debug = opts?.debug ?? false;

	const scrollThresholds = (opts?.scrollThresholds ?? [25, 50, 75, 90])
		.map((n) => Math.max(1, Math.min(100, Math.round(n))))
		.sort((a, b) => a - b);

	const timeThresholdsSec = (opts?.timeThresholdsSec ?? [10, 30, 60, 120])
		.map((n) => Math.max(1, Math.round(n)))
		.sort((a, b) => a - b);

	const firedScroll = new Set<number>();
	const firedTime = new Set<number>();
	const startedAt = Date.now();

	// ---- scroll milestones ----
	let rafPending = false;

	const onScroll = () => {
		if (rafPending) return;
		rafPending = true;

		requestAnimationFrame(() => {
			rafPending = false;

			const depth = getScrollDepthPct();
			const time_on_page_sec = Math.max(
				0,
				Math.round((Date.now() - startedAt) / 1000),
			);

			for (const t of scrollThresholds) {
				if (depth >= t && !firedScroll.has(t)) {
					firedScroll.add(t);

					void postEvent(
						`scroll_${t}`,
						{ scroll_depth: depth, time_on_page_sec: null },
						debug,
					);

					// page_engaged rule: scroll >= 25%
					if (t >= 25) {
						void postPageEngagedIfNeeded(
							debug,
							"scroll>=25",
							time_on_page_sec,
							depth,
						);
					}
				}
			}
		});
	};

	window.addEventListener("scroll", onScroll, { passive: true });

	// ---- time milestones ----
	const timers: number[] = [];

	for (const sec of timeThresholdsSec) {
		const id = window.setTimeout(() => {
			if (firedTime.has(sec)) return;
			firedTime.add(sec);

			const time_on_page_sec = Math.max(
				0,
				Math.round((Date.now() - startedAt) / 1000),
			);
			const scroll_depth = getScrollDepthPct();

			void postEvent(`time_${sec}s`, { time_on_page_sec, scroll_depth }, debug);

			// page_engaged rule: time >= 10s
			if (sec >= 10) {
				void postPageEngagedIfNeeded(
					debug,
					"time>=10s",
					time_on_page_sec,
					scroll_depth,
				);
			}
		}, sec * 1000);

		timers.push(id);
	}

	// ---- cleanup ----
	return () => {
		window.removeEventListener("scroll", onScroll);
		for (const id of timers) window.clearTimeout(id);
	};
}
