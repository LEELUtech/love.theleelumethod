export function redirectToWebinar(params: { name?: string; email?: string }) {
  const baseUrl = "https://leelutech.ewebinar.com/webinar/decoded-love-22610";
  const url = new URL(baseUrl);
  if (params.name) url.searchParams.set("name", params.name);
  if (params.email) url.searchParams.set("email", params.email);
  window.location.href = url.toString();
}