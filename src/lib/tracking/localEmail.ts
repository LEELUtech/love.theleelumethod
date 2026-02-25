const LS_EMAIL = "ff_email";

export function saveEmailToLS(emailRaw: string) {
  try {
    const email = (emailRaw || "").trim().toLowerCase();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) return;
    localStorage.setItem(LS_EMAIL, email);
  } catch {
  }
}

export function getEmailFromLS(): string | null {
  try {
    return localStorage.getItem(LS_EMAIL);
  } catch {
    return null;
  }
}