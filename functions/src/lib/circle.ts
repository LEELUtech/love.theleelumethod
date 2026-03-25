import { configs } from "../configs/env";
import { db } from "../configs/firebase";
import {
  CircleMember,
  CircleMemberNotFound,
  CreateMemberResponse,
  CreateSpaceResponse,
  GrantAccessResponse,
} from "../types/circle";
import { CIRCLE_TIER } from "../types/typeform";

const getCircleConfig = () => ({
  apiKey: configs.circleApiKey || "PLACEHOLDER_API_KEY",
  headlessKey: configs.circleHeadlessKey || "PLACEHOLDER_HEADLESS_KEY",

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

  // "user not added to space" usually means already invited/member
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

  if (!response.ok && response.status === 404) {
    return (await response.json()) as T;
  }

  if (!response.ok) {
    const bodyText = await response.text();

    if (cfg?.tolerateIdempotentGrantErrors && isIdempotentGrantError(response.status, bodyText)) {
      console.log("[Circle] Non-fatal grant error (treated as success)", {
        endpoint,
        status: response.status,
        body: bodyText,
      });

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

interface IProcessCircleAccess {
  email: string;
  name: string;
  spaceId?: string;
  courseId?: string;
}

type ProcessCircleAccess = (
  params: IProcessCircleAccess,
) => Promise<{ memberId: number; isNewMember: boolean }>;

export const processCircleAccess: ProcessCircleAccess = async (params) => {
  const { email, name, spaceId, courseId } = params;

  let member = await findCircleMemberByEmail(email);
  let isNewMember = false;

  if (!member) {
    member = await createCircleMember(email, name);
    isNewMember = true;
  }

  if (spaceId) await grantCircleSpaceAccess(email, spaceId);
  if (courseId) await grantCircleCourseAccess(email, courseId);

  return { memberId: member.id, isNewMember };
};

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
  member_tag_id: number,
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

    console.log("addTagToMember response:", response);

    return response.success;
  } catch (error) {
    console.error("Error adding tag to member:", error);
    return false;
  }
};

interface CreateChatResponse {
  chat_room: {
    id: number;
    uuid: string;
  };
}

type CreateChat = (
  memberId: number,
  token: string,
  tier: CIRCLE_TIER,
) => Promise<CreateChatResponse | null>;

export const createChat: CreateChat = async (memberId, token, tier) => {
  const isEssential = tier === CIRCLE_TIER.ESSENTIALS;

  const adminDoc = await db.collection("circle_admins").doc("Admin").get();

  const adminId = adminDoc.data()?.id;

  const community_member_ids = isEssential ? [memberId + ""] : [adminId + "", memberId + ""];

  const payload = {
    chat_room: { kind: "group_chat", community_member_ids, title: "YOUR WORK (PRIVATE HOMEWORK)" },
  };

  try {
    const res = await fetch("https://app.circle.so/api/headless/v1/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.status == 200) {
      const data = await res.json();

      return data as CreateChatResponse;
    }

    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deactivateCircleMember = async (email: string): Promise<boolean> => {
  const member = await findCircleMemberByEmail(email);
  if (!member) {
    console.warn("[Circle] deactivateCircleMember: member not found", { email });
    return false;
  }

  try {
    const response = await makeCircleRequest<{ success: boolean }>(
      `/community_members/${member.id}`,
      { method: "DELETE" },
    );
    return response.success;
  } catch (err) {
    console.error("[Circle] deactivateCircleMember failed", { email, err });
    return false;
  }
};

export const sendMessage = async (chatId: string, text: string, token: string): Promise<void> => {
  const payload = {
    rich_text_body: {
      body: {
        type: "doc",
        content: [{ type: "paragraph", content: [{ type: "text", text }] }],
      },
    },
  };

  try {
    await fetch(`https://app.circle.so/api/headless/v1/messages/${chatId}/chat_room_messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    console.log("Error sending message to Circle chat:", { chatId, text });
  }
};

interface MemberTokenResponse {
  access_token: string;
  community_member_id: number;
  expires_in: number;
}

type GetMemberToken = (email: string) => Promise<MemberTokenResponse | null>;

interface CircleSpaceListItem {
  id: number;
  name: string;
  slug: string;
}

export interface CircleCourseMemberRecord {
  community_member_id: number;
  community_member?: {
    email?: string;
  };
}

interface CircleCourseMembersListResponse {
  records: CircleCourseMemberRecord[];
  has_next_page: boolean;
}

export interface CircleCommunityMemberRecord {
  id: number;
  email?: string;
  last_seen_at?: string | null;
}

interface CircleCommunityMembersListResponse {
  records: CircleCommunityMemberRecord[];
  has_next_page: boolean;
}

export async function getCircleSpaceIdBySlug(slug: string): Promise<number | null> {
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    try {
      const resp = await makeCircleRequest<{
        records?: CircleSpaceListItem[];
        has_next_page?: boolean;
      }>(`/spaces?per_page=100&page=${page}`, { method: "GET" });

      const records = resp.records ?? [];
      const match = records.find((s) => s.slug === slug);
      if (match) return match.id;

      hasNext = !!resp.has_next_page && records.length > 0;
      page++;
    } catch {
      return null;
    }
  }
  return null;
}

export async function getAllCircleCourseMembersForCourse(
  spaceId: number,
): Promise<CircleCourseMemberRecord[]> {
  const all: CircleCourseMemberRecord[] = [];
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    const resp = await makeCircleRequest<CircleCourseMembersListResponse>(
      `/space_members?space_id=${spaceId}&per_page=100&page=${page}`,
      { method: "GET" },
    );
    all.push(...(resp.records ?? []));
    hasNext = resp.has_next_page;
    page++;
  }
  return all;
}

export async function getAllCommunityMembers(): Promise<CircleCommunityMemberRecord[]> {
  const all: CircleCommunityMemberRecord[] = [];
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    const resp = await makeCircleRequest<CircleCommunityMembersListResponse>(
      `/community_members?per_page=100&page=${page}`,
      { method: "GET" },
    );
    all.push(...(resp.records ?? []));
    hasNext = resp.has_next_page;
    page++;
  }
  return all;
}

export const getMemberToken: GetMemberToken = async (email) => {
  const { headlessKey } = getCircleConfig();

  try {
    const res = await fetch("https://app.circle.so/api/v1/headless/auth_token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${headlessKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (res.status === 200) {
      const tokenData: MemberTokenResponse = await res.json();
      return tokenData;
    }

    return null;
  } catch (err) {
    console.error("Error fetching member token:", err);
    return null;
  }
};
