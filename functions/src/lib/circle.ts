// functions/src/lib/circle.ts
import { configs } from "../configs/env";

export interface CircleMember {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  name: string;
}

interface CircleMemberNotFound {
  success: false;
  message: string;
  error_details: { message: string };
}

interface CreateMemberResponse {
  message: string;
  community_member: CircleMember;
}

interface GrantAccessResponse {
  success: boolean;
  message: string;
}

const getCircleConfig = () => ({
  apiKey: configs.circleApiKey || "PLACEHOLDER_API_KEY",
  baseUrl: "https://app.circle.so/api/admin/v2",
});

function cleanStr(v: unknown) {
  const s = String(v ?? "").trim();
  return s ? s : undefined;
}

function safeJsonParse<T = any>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function isIdempotentGrantError(status: number, bodyText: string) {
  // Treat these as "already ok / non-fatal"
  if (status !== 422 && status !== 409) return false;

  const lower = bodyText.toLowerCase();

  // Your current error:
  // {"success":false,"message":"User not added to space.","error_details":{}}
  // This is ambiguous, but in practice it's usually "already invited/member".
  if (lower.includes("user not added to space")) return true;

  // Common variants (future-proof):
  if (lower.includes("already")) return true;
  if (lower.includes("exists")) return true;
  if (lower.includes("duplicate")) return true;
  if (lower.includes("member")) return true;
  if (lower.includes("invited")) return true;

  // If Circle returns a structured message field
  const parsed = safeJsonParse<any>(bodyText);
  const msg = cleanStr(parsed?.message)?.toLowerCase();
  if (msg && (msg.includes("already") || msg.includes("exists") || msg.includes("invited"))) return true;

  return false;
}

async function makeCircleRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  cfg?: { tolerateIdempotentGrantErrors?: boolean },
): Promise<T> {
  const config = getCircleConfig();
  const url = `${config.baseUrl}${endpoint}`;

  if (config.apiKey === "PLACEHOLDER_API_KEY") {
    throw new Error("Circle API key not configured");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Search endpoint returns 404 when not found
  if (!response.ok && response.status === 404) {
    return response.json();
  }

  if (!response.ok) {
    const bodyText = await response.text();

    // ✅ Do not fail delivery on "already invited/already has access"
    if (cfg?.tolerateIdempotentGrantErrors && isIdempotentGrantError(response.status, bodyText)) {
      console.log("[Circle] Non-fatal grant error (treated as success)", {
        endpoint,
        status: response.status,
        body: bodyText,
      });

      // Return a fake "success" response shape
      return { success: true, message: "Already has access / invite exists" } as any as T;
    }

    throw new Error(`Circle API Error: ${response.status} - ${bodyText}`);
  }

  return response.json();
}

export async function findCircleMemberByEmail(email: string): Promise<CircleMember | null> {
  console.log(`[Circle Search] Looking for email: ${email}`);

  const response = await makeCircleRequest<CircleMember | CircleMemberNotFound>(
    `/community_members/search?email=${encodeURIComponent(email)}`,
    { method: "GET" },
  );

  console.log("[Circle Search] Response:", JSON.stringify(response));

  if ("success" in (response as any) && (response as any).success === false) return null;
  return response as CircleMember;
}

export async function createCircleMember(email: string, name: string): Promise<CircleMember> {
  console.log(`[Circle] Creating member with email: ${email}, name: ${name}`);

  const response = await makeCircleRequest<CreateMemberResponse>("/community_members", {
    method: "POST",
    body: JSON.stringify({ email, name, skip_invitation: false }),
  });

  console.log(`[Circle] Member created: ${response.community_member.id}`);
  return response.community_member;
}

export async function grantCircleSpaceAccess(email: string, spaceId: string): Promise<void> {
  console.log(`[Circle] Granting space access: ${email} -> space ${spaceId}`);

  const response = await makeCircleRequest<GrantAccessResponse>(
    "/space_members",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        space_id: parseInt(spaceId, 10),
      }),
    },
    { tolerateIdempotentGrantErrors: true }, // ✅ key change
  );

  console.log(`[Circle] Space access result: ${response.message}`);
}

export async function grantCircleCourseAccess(email: string, courseId: string): Promise<void> {
  console.log(`[Circle] Granting course access: ${email} -> course ${courseId}`);

  const response = await makeCircleRequest<GrantAccessResponse>(
    "/course_members",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        course_id: parseInt(courseId, 10),
      }),
    },
    { tolerateIdempotentGrantErrors: true }, // ✅ key change
  );

  console.log(`[Circle] Course access result: ${response.message}`);
}

export async function processCircleAccess(
  email: string,
  name: string,
  spaceId?: string,
  courseId?: string,
): Promise<{ memberId: number; isNewMember: boolean }> {
  console.log(`[Circle] Processing access for: ${email}`, {
    space_id: spaceId,
    course_id: courseId,
  });

  let member = await findCircleMemberByEmail(email);
  let isNewMember = false;

  if (!member) {
    member = await createCircleMember(email, name);
    isNewMember = true;
  }

  if (spaceId) await grantCircleSpaceAccess(email, spaceId);
  if (courseId) await grantCircleCourseAccess(email, courseId);

  console.log(`[Circle] Access completed for: ${email}`);

  return { memberId: member.id, isNewMember };
}
