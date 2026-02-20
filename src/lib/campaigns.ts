// lib/campaigns.ts
export async function addCampaignTags(
  email: string,
  tags: string[]
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/add-tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        tags,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to add campaign tags:", data.error);
      return { ok: false, error: data.error || "Unknown error" };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    console.error("addCampaignTags error:", err);
    return { ok: false, error: message };
  }
}
