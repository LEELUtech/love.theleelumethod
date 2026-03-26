export interface CircleMember {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at?: string;
}

export interface CircleMemberResponse {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface CreateMemberParams {
  email: string;
  name: string;
  skip_invitation?: boolean;
}

export interface GrantAccessParams {
  member_id: string;
  email: string;
  space_id?: string;
  course_id?: string;
}

// Configuration
const getCircleConfig = () => ({
  apiKey: process.env.CIRCLE_API_KEY || process.env.NEXT_PUBLIC_CIRCLE_API_KEY || "PLACEHOLDER_API_KEY",
  communityId: process.env.CIRCLE_COMMUNITY_ID || process.env.NEXT_PUBLIC_CIRCLE_COMMUNITY_ID || "PLACEHOLDER_COMMUNITY_ID",
  communityUrl: process.env.CIRCLE_COMMUNITY_URL || process.env.NEXT_PUBLIC_CIRCLE_COMMUNITY_URL || "",
  baseUrl: "https://app.circle.so/api/admin/v2"
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function makeCircleRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const config = getCircleConfig();
  const url = `${config.baseUrl}${endpoint}`;

  if (config.apiKey === "PLACEHOLDER_API_KEY") {
    console.warn("Circle API key not configured. Using placeholder.");
    // Return mock data for development
    return {} as T;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(
      `Circle API Error: ${response.status} - ${errorData}`
    );
  }

  return response.json();
}

export async function findMemberByEmail(email: string): Promise<CircleMember | null> {
  try {
    const response = await makeCircleRequest<{ records: CircleMember[] }>(
      `/community_members?email=${encodeURIComponent(email)}&per_page=1`,
      { method: "GET" }
    );
    if (response.records && response.records.length > 0) {
      return response.records[0];
    }
    return null;
  } catch (error) {
    console.error("[Circle] Error finding member:", error);
    throw error;
  }
}

export async function createCircleMember(params: CreateMemberParams): Promise<CircleMemberResponse> {
  try {
    const response = await makeCircleRequest<CircleMemberResponse>(
      "/community_members",
      {
        method: "POST",
        body: JSON.stringify({
          email: params.email,
          name: params.name,
          skip_invitation: params.skip_invitation ?? false,
        }),
      }
    );
    return response;
  } catch (error) {
    console.error("[Circle] Error creating member:", error);
    throw error;
  }
}

export async function grantCircleAccess(params: GrantAccessParams): Promise<void> {
  try {
    if (params.space_id) {
      await makeCircleRequest(
        "/space_members",
        {
          method: "POST",
          body: JSON.stringify({
            email: params.email,
            space_id: parseInt(params.space_id),
          }),
        }
      );
      console.log(`[Circle] Granted access to space: ${params.space_id}`);
    }
  } catch (error) {
    console.error("[Circle] Error granting access:", error);
    throw error;
  }
}

async function grantSpaceWithRetry(
  email: string,
  name: string,
  spaceId: string,
  courseId: string | undefined,
  member: CircleMember
): Promise<CircleMember> {
  try {
    await grantCircleAccess({
      member_id: member.id,
      email,
      space_id: spaceId,
      course_id: courseId,
    });
    return member;
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : "";
    const missingUser = errMessage.includes("Missing record: user");
    if (!missingUser) throw err;

    console.warn("[Circle] User missing on grant, recreating and retrying...");
    const recreated = await createCircleMember({
      email,
      name,
      skip_invitation: false,
    });
    await sleep(500);
    const newMember: CircleMember = { ...recreated, created_at: new Date().toISOString() };
    await grantCircleAccess({
      member_id: newMember.id,
      email,
      space_id: spaceId,
      course_id: courseId,
    });
    return newMember;
  }
}

export async function createOrGrantCircleAccess(
  email: string,
  name: string,
  spaceId?: string,
  courseId?: string
): Promise<{ memberId: string; isNewMember: boolean }> {
  try {
    console.log(`[Circle] Processing access for: ${email}`);

    let member = await findMemberByEmail(email);
    let isNewMember = false;
    console.log('[Circle] Member lookup result:', member);

    if (!member) {
      console.log(`[Circle] Creating new member: ${email}`);
      const newMember = await createCircleMember({
        email,
        name,
        skip_invitation: false,
      });
      member = { ...newMember, created_at: new Date().toISOString() };
      isNewMember = true;
      await sleep(500); // Small pause to avoid race
    } else {
      console.log(`[Circle] Member already exists: ${email} (${member.id})`);
    }

    if (spaceId) {
      console.log(`[Circle] Granting access to space: ${spaceId}`);
      member = await grantSpaceWithRetry(email, name, spaceId, courseId, member);
    }

    console.log(`[Circle] Access completed for: ${email}`);
    return {
      memberId: member.id,
      isNewMember,
    };
  } catch (error) {
    console.error("[Circle] Error in createOrGrantCircleAccess:", error);
    throw error;
  }
}

export function getCircleCourseUrl(spaceSlug?: string, courseSlug?: string): string {
  const config = getCircleConfig();
  const baseUrl = config.communityUrl || `https://${config.communityId}.circle.so`;
  if (courseSlug && spaceSlug) {
    return `${baseUrl}/c/${spaceSlug}/${courseSlug}`;
  } else if (spaceSlug) {
    return `${baseUrl}/c/${spaceSlug}`;
  }
  return baseUrl;
}
