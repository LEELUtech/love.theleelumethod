/**
 * Circle API Client - Functional approach
 * Documentation: https://api.circle.so/
 */

// Types
export interface CircleMember {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
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
  send_magic_link?: boolean;
}

export interface GrantAccessParams {
  member_id: string;
  space_id?: string;
  course_id?: string;
}

// Configuration
const getCircleConfig = () => ({
  apiKey: process.env.CIRCLE_API_KEY || process.env.NEXT_PUBLIC_CIRCLE_API_KEY || "PLACEHOLDER_API_KEY",
  communityId: process.env.CIRCLE_COMMUNITY_ID || process.env.NEXT_PUBLIC_CIRCLE_COMMUNITY_ID || "PLACEHOLDER_COMMUNITY_ID",
  communityUrl: process.env.CIRCLE_COMMUNITY_URL || process.env.NEXT_PUBLIC_CIRCLE_COMMUNITY_URL || "",
  baseUrl: "https://api.circle.so/v1"
});

// Private helper: Make API request
async function makeCircleRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const config = getCircleConfig();
  const url = `${config.baseUrl}${endpoint}`;
  
  if (config.apiKey === "PLACEHOLDER_API_KEY") {
    console.warn("⚠️ Circle API key not configured. Using placeholder.");
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

/**
 * Find a Circle member by email
 */
export async function findMemberByEmail(email: string): Promise<CircleMember | null> {
  try {
    // Circle API: GET /community_members?email=xxx
    const response = await makeCircleRequest<{ community_members: CircleMember[] }>(
      `/community_members?email=${encodeURIComponent(email)}`,
      { method: "GET" }
    );

    if (response.community_members && response.community_members.length > 0) {
      return response.community_members[0];
    }

    return null;
  } catch (error) {
    console.error("Error finding Circle member:", error);
    throw error;
  }
}

/**
 * Create or invite a new Circle member
 */
export async function createCircleMember(params: CreateMemberParams): Promise<CircleMemberResponse> {
  try {
    // Circle API: POST /community_members
    const response = await makeCircleRequest<{ community_member: CircleMemberResponse }>(
      "/community_members",
      {
        method: "POST",
        body: JSON.stringify({
          email: params.email,
          name: params.name,
          skip_invitation: params.skip_invitation ?? false,
          send_magic_link: params.send_magic_link ?? true,
        }),
      }
    );

    return response.community_member;
  } catch (error) {
    console.error("Error creating Circle member:", error);
    throw error;
  }
}

/**
 * Grant access to a Circle space or course
 */
export async function grantCircleAccess(params: GrantAccessParams): Promise<void> {
  try {
    if (params.space_id) {
      // Circle API: POST /space_members
      await makeCircleRequest(
        "/space_members",
        {
          method: "POST",
          body: JSON.stringify({
            community_member_id: params.member_id,
            space_id: params.space_id,
          }),
        }
      );
      console.log(`✅ Granted access to space: ${params.space_id}`);
    }

    // If you need to grant course access separately, add here
    // Note: In Circle, courses are typically inside spaces
    // so space membership might be sufficient
    
  } catch (error) {
    console.error("Error granting Circle access:", error);
    throw error;
  }
}

/**
 * Resend magic link to a Circle member
 */
export async function resendCircleMagicLink(email: string): Promise<void> {
  try {
    // Circle API: POST /magic_links
    await makeCircleRequest(
      "/magic_links",
      {
        method: "POST",
        body: JSON.stringify({
          email: email,
        }),
      }
    );
    console.log(`✅ Magic link sent to: ${email}`);
  } catch (error) {
    console.error("Error resending Circle magic link:", error);
    throw error;
  }
}

/**
 * Main function: Create member and grant course access atomically
 * This is the primary function called from webhooks
 */
export async function createOrGrantCircleAccess(
  email: string,
  name: string,
  spaceId?: string,
  courseId?: string
): Promise<{ memberId: string; isNewMember: boolean }> {
  try {
    console.log(`🔄 Processing Circle access for: ${email}`);
    
    // Step 1: Check if member exists
    let member = await findMemberByEmail(email);
    let isNewMember = false;

    // Step 2: Create member if doesn't exist
    if (!member) {
      console.log(`➕ Creating new Circle member: ${email}`);
      const newMember = await createCircleMember({
        email,
        name,
        send_magic_link: true,
      });
      member = { ...newMember, created_at: new Date().toISOString() };
      isNewMember = true;
    } else {
      console.log(`✓ Member already exists: ${email} (${member.id})`);
    }

    // Step 3: Grant access to space/course
    if (spaceId) {
      console.log(`🔑 Granting access to space: ${spaceId}`);
      await grantCircleAccess({
        member_id: member.id,
        space_id: spaceId,
        course_id: courseId,
      });
    }

    console.log(`✅ Circle access completed for: ${email}`);
    
    return {
      memberId: member.id,
      isNewMember,
    };
  } catch (error) {
    console.error("❌ Error in createOrGrantCircleAccess:", error);
    throw error;
  }
}

/**
 * Get the direct URL to a Circle space or course
 */
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
