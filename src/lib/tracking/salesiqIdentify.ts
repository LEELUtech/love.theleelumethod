"use client";

type IdentifyPayload = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

function clean(v?: string | null) {
  const s = (v ?? "").trim();
  return s || undefined;
}

function getSalesIQ(): any {
  const w = window as any;
  return w.$zoho?.salesiq || w.ZohoSalesIQ || null;
}

export function salesiqIdentify(p: IdentifyPayload) {
  const siq = getSalesIQ();
  if (!siq) return;

  const email = clean(p.email);
  const firstName = clean(p.firstName);
  const lastName = clean(p.lastName);
  const phone = clean(p.phone);

  if (!email && !phone && !firstName && !lastName) return;

  const name = [firstName, lastName].filter(Boolean).join(" ") || undefined;

  try {
    if (name && siq.visitor?.name) siq.visitor.name(name);
    if (email && siq.visitor?.email) siq.visitor.email(email);
    if (phone && siq.visitor?.contactnumber) siq.visitor.contactnumber(phone);

    if (siq.visitor?.info) {
      siq.visitor.info({
        ...(email ? { Email: email } : {}),
        ...(phone ? { Phone: phone } : {}),
        ...(firstName ? { First_Name: firstName } : {}),
        ...(lastName ? { Last_Name: lastName } : {}),
      });
    }

    if (siq.visitor?.uniqueid) {
      const visitorId = siq.visitor.uniqueid();
      if (visitorId) localStorage.setItem("ff_salesiq_visitor_id", String(visitorId));
    }
  } catch {
    // best-effort
  }
}
