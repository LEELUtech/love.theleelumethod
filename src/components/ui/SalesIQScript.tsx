
"use client";

import Script from "next/script";

export default function SalesIQScript() {
  const widgetCode = process.env.NEXT_PUBLIC_SALESIQ_WIDGET_CODE || "";
  const debug = process.env.NEXT_PUBLIC_TRACKING_DEBUG === "1";

  return (
    <>
      <Script
        id="salesiq-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  var DEBUG = ${debug ? "true" : "false"};

  window.$zoho = window.$zoho || {};
  window.$zoho.salesiq = window.$zoho.salesiq || {};
  window.$zoho.salesiq.widgetcode = "${widgetCode}";
  window.$zoho.salesiq.values = window.$zoho.salesiq.values || {};

  function log() {
    try { if (DEBUG) console.log.apply(console, arguments); } catch (e) {}
  }

  function getOrCreateSessionId() {
    try {
      var key = "ff_session_id";
      var existing = localStorage.getItem(key);
      if (existing && existing.trim()) return existing.trim();

      var sid = "sid_" + Date.now() + "_" + Math.random().toString(16).slice(2);
      localStorage.setItem(key, sid);
      return sid;
    } catch (e) {
      return "sid_" + Date.now() + "_" + Math.random().toString(16).slice(2);
    }
  }

  function loadJson(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function toNull(x) {
    var s = (x == null ? "" : String(x)).trim();
    return s ? s : null;
  }

  function getContext() {
    var landing_page = null;
    try { landing_page = localStorage.getItem("ff_landing_page"); } catch (e) {}

    var utm_first = loadJson("ff_utm_first") || {};
    var utm_last  = loadJson("ff_utm_last")  || {};

    return {
      landing_page: toNull(landing_page),

      utm_first_source: toNull(utm_first.utm_source),
      utm_first_medium: toNull(utm_first.utm_medium),
      utm_first_campaign: toNull(utm_first.utm_campaign),
      utm_first_content: toNull(utm_first.utm_content),
      utm_first_term: toNull(utm_first.utm_term),

      utm_last_source: toNull(utm_last.utm_source),
      utm_last_medium: toNull(utm_last.utm_medium),
      utm_last_campaign: toNull(utm_last.utm_campaign),
      utm_last_content: toNull(utm_last.utm_content),
      utm_last_term: toNull(utm_last.utm_term),
    };
  }

  function readSalesiqVisitorId() {
    try {
      var x = localStorage.getItem("ff_salesiq_visitor_id");
      return toNull(x);
    } catch (e) {
      return null;
    }
  }

  function postEvent(step, extra) {
    try {
      var session_id = getOrCreateSessionId();
      var site = (location.host || "unknown").toLowerCase().split(":")[0] || "unknown";
      var page_path = location.pathname || "/";
      var ctx = getContext();

      var payload = Object.assign({
        event_id: session_id + ":" + Date.now() + ":" + step,
        event_time: new Date().toISOString(),
        source: "salesiq",
        funnel_step: step,

        session_id: session_id,
        salesiq_visitor_id: readSalesiqVisitorId(),

        site: site,
        landing_page: ctx.landing_page,
        page_path: page_path,

        chat_opened: (step === "chat_opened" || step === "chat_started") ? true : null,

        utm_first_source: ctx.utm_first_source,
        utm_first_medium: ctx.utm_first_medium,
        utm_first_campaign: ctx.utm_first_campaign,
        utm_first_content: ctx.utm_first_content,
        utm_first_term: ctx.utm_first_term,

        utm_last_source: ctx.utm_last_source,
        utm_last_medium: ctx.utm_last_medium,
        utm_last_campaign: ctx.utm_last_campaign,
        utm_last_content: ctx.utm_last_content,
        utm_last_term: ctx.utm_last_term,

        email: null,
        intent_token: null,
        payment_intent_id: null,
        scroll_depth: null,
        time_on_page_sec: null,
      }, extra || {});

      fetch("/api/event-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify(payload),
      }).catch(function(){});
    } catch (e) {}
  }

  function bindDomOpenTracker() {
    var lastTs = 0;

    document.addEventListener("click", function (e) {
      try {
        var t = e.target;
        if (!t) return;

        var el = t;
        for (var i = 0; i < 6 && el; i++) {
          var id = (el.id || "").toLowerCase();
          var cls = (el.className || "").toString().toLowerCase();

          if (id.indexOf("zsiq") >= 0 || cls.indexOf("zsiq") >= 0 || cls.indexOf("salesiq") >= 0) {
            var now = Date.now();
            if (now - lastTs > 1500) {
              lastTs = now;
              log("[SalesIQ] DOM open detected");
              postEvent("chat_opened");
            }
            return;
          }

          el = el.parentElement;
        }
      } catch (err) {}
    }, true);

    log("[SalesIQ] DOM open tracker bound");
  }

  function bindVisitorChat() {
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      var v = window.$zoho && window.$zoho.salesiq && window.$zoho.salesiq.visitor;

      if (v && typeof v.chat === "function") {
        clearInterval(t);
        log("[SalesIQ] visitor.chat API detected");

        v.chat(function (visitid, data) {
          try {
            if (visitid != null) {
              localStorage.setItem("ff_salesiq_visitor_id", String(visitid));
            }
          } catch (e) {}

          log("[SalesIQ] visitor.chat fired", visitid, data);

          postEvent("chat_started", {
            email: (data && data.email) ? data.email : null,
          });
        });

        return;
      }

      if (tries > 50) {
        clearInterval(t);
        log("[SalesIQ] visitor.chat API NOT found (timeout)");
      }
    }, 300);
  }

  window.$zoho.salesiq.ready = function () {
    log("[SalesIQ] READY fired");

    getOrCreateSessionId();

    bindDomOpenTracker();
    bindVisitorChat();
  };
})();`,
        }}
      />

      <Script
        id="zsiqscript"
        src="https://salesiq.zoho.com/widget"
        strategy="afterInteractive"
        onLoad={() => {
          if (debug) console.log("[SalesIQ] widget script loaded");
        }}
      />
    </>
  );
}
