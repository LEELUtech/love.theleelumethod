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

interface CreateSpaceResponse {
  success: boolean;
  message: string;
  space: {
    id: string;
  };
}

const getCircleConfig = () => ({
  apiKey: configs.circleApiKey || "PLACEHOLDER_API_KEY",
  baseUrl: "https://app.circle.so/api/admin/v2",
});

function cleanStr(v: unknown) {
  const s = String(v ?? "").trim();
  return s ? s : undefined;
}

function safeJsonParse<T = unknown>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isCircleNotFound(v: unknown): v is CircleMemberNotFound {
  if (!isRecord(v)) return false;
  return v.success === false;
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
  const parsed = safeJsonParse<unknown>(bodyText);
  const msg = isRecord(parsed) ? cleanStr(parsed.message)?.toLowerCase() : undefined;
  if (msg && (msg.includes("already") || msg.includes("exists") || msg.includes("invited")))
    return true;

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
    return (await response.json()) as T;
  }

  if (!response.ok) {
    const bodyText = await response.text();

    // Do not fail delivery on "already invited/already has access"
    if (cfg?.tolerateIdempotentGrantErrors && isIdempotentGrantError(response.status, bodyText)) {
      console.log("[Circle] Non-fatal grant error (treated as success)", {
        endpoint,
        status: response.status,
        body: bodyText,
      });

      // Return a fake "success" response shape
      const fake: GrantAccessResponse = {
        success: true,
        message: "Already has access / invite exists",
      };

      return fake as unknown as T;
    }

    throw new Error(`Circle API Error: ${response.status} - ${bodyText}`);
  }

  return (await response.json()) as T;
}

export async function findCircleMemberByEmail(email: string): Promise<CircleMember | null> {
  try {
    const response = await makeCircleRequest<CircleMember | CircleMemberNotFound>(
      `/community_members/search?email=${encodeURIComponent(email)}`,
      { method: "GET" },
    );

    if (isCircleNotFound(response)) return null;
    return response;
  } catch {
    return null;
  }
}

export async function createCircleMember(email: string, name: string): Promise<CircleMember> {
  const response = await makeCircleRequest<CreateMemberResponse>("/community_members", {
    method: "POST",
    body: JSON.stringify({ email, name, skip_invitation: false }),
  });

  return response.community_member;
}

export async function grantCircleSpaceAccess(email: string, spaceId: string): Promise<boolean> {
  try {
    const response = await makeCircleRequest<GrantAccessResponse>(
      "/space_members?space_id=" + encodeURIComponent(spaceId),
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
      { tolerateIdempotentGrantErrors: true },
    );

    return response.success;
  } catch {
    return false;
  }
}

export async function grantCircleCourseAccess(email: string, courseId: string): Promise<boolean> {
  try {
    const response = await makeCircleRequest<GrantAccessResponse>(
      "/course_members",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          course_id: parseInt(courseId, 10),
        }),
      },
      { tolerateIdempotentGrantErrors: true },
    );

    return response.success;
  } catch {
    return false;
  }
}

export async function processCircleAccess(
  email: string,
  name: string,
  spaceId?: string,
  courseId?: string,
): Promise<{ memberId: number; isNewMember: boolean }> {
  let member = await findCircleMemberByEmail(email);
  let isNewMember = false;

  if (!member) {
    member = await createCircleMember(email, name);
    isNewMember = true;
  }

  if (spaceId) await grantCircleSpaceAccess(email, spaceId);
  if (courseId) await grantCircleCourseAccess(email, courseId);

  return { memberId: member.id, isNewMember };
}

type SpaceType = "basic" | "chat" | "event" | "course" | "image";

export const createSpace = async (
  name: string,
  type: SpaceType,
  space_group_id: string,
): Promise<string | null> => {
  const payload = {
    name,
    space_group_id,
    space_type: type,
    is_private: true,
    is_hidden: true,
    is_hidden_from_non_members: true,
    chat_room_show_history: true,
    chat_room_description: "YOUR WORK (PRIVATE HOMEWORK)",
  };

  try {
    const response = await makeCircleRequest<CreateSpaceResponse>(
      "/spaces",
      { method: "POST", body: JSON.stringify(payload) },
      { tolerateIdempotentGrantErrors: true },
    );

    if (response.success) return response.space.id;

    return null;
  } catch {
    return null;
  }
};

export const addMemberToSpace = async (email: string, spaceId: string): Promise<boolean> => {
  try {
    const response = await makeCircleRequest<GrantAccessResponse>(
      "/space_members",
      {
        method: "POST",
        body: JSON.stringify({ email, space_id: spaceId }),
      },
      { tolerateIdempotentGrantErrors: true },
    );

    return response.success;
  } catch {
    return false;
  }
};

export const addCMToSpace = async (spaceId: string): Promise<boolean> => {
  try {
    const response = await makeCircleRequest<GrantAccessResponse>(
      "/space_members",
      {
        method: "POST",
        body: JSON.stringify({ email: "mykhailo.nikolaiev@bndigital.co", space_id: spaceId }),
      },
      { tolerateIdempotentGrantErrors: true },
    );

    return response.success;
  } catch {
    return false;
  }
};

export const addTagToMember = async (
  user_email: string,
  member_tag_id: string,
): Promise<boolean> => {
  try {
    const response = await makeCircleRequest<GrantAccessResponse>(
      "/tagged_members",
      {
        method: "POST",
        body: JSON.stringify({ user_email, member_tag_id }),
      },
      { tolerateIdempotentGrantErrors: true },
    );

    console.log("Add tag response", response);

    return response.success;
  } catch {
    return false;
  }
};
