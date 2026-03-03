export async function addCampaignTags(
  email: string,
  tags: string[]
): Promise<{ ok: boolean; error?: string }> {
  return updateCampaignTags(email, { add: tags });
}


export async function updateCampaignTags(
  email: string,
  delta: { add?: string[]; remove?: string[] }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/add-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        add: delta.add ?? [],
        remove: delta.remove ?? [],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to update campaign tags:", data.error);
      return { ok: false, error: data.error || "Unknown error" };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    console.error("updateCampaignTags error:", err);
    return { ok: false, error: message };
  }
}

// Variant that requests the API not to subscribe/create the contact.
export async function updateCampaignTagsNoSubscribe(
  email: string,
  delta: { add?: string[]; remove?: string[] },
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/add-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        add: delta.add ?? [],
        remove: delta.remove ?? [],
        skip_subscribe: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to update campaign tags (no-subscribe):", data.error);
      return { ok: false, error: data.error || "Unknown error" };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    console.error("updateCampaignTagsNoSubscribe error:", err);
    return { ok: false, error: message };
  }
}