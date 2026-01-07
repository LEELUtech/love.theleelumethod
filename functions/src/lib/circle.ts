/**
 * Circle API Service
 * Handles all Circle community member management and access control
 */

import { configs } from "../configs/env";

// Types
export interface CircleMemberResponse {
  id: string;
  email: string;
  name: string;
}

interface CircleMember {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at?: string;
}

// Configuration
const getCircleConfig = () => ({
  apiKey: configs.circleApiKey || "PLACEHOLDER_API_KEY",
  baseUrl: "https://api.circle.so/v1"
});

/**
 * Make a request to Circle API
 */
async function makeCircleRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const config = getCircleConfig();
  const url = `${config.baseUrl}${endpoint}`;
  
  if (config.apiKey === "PLACEHOLDER_API_KEY") {
    console.warn("⚠️ Circle API key not configured.");
    throw new Error("Circle API key not configured");
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
    throw new Error(`Circle API Error: ${response.status} - ${errorData}`);
  }

  return response.json();
}

/**
 * Find a Circle member by email
 */
export async function findCircleMemberByEmail(email: string): Promise<CircleMember | null> {
  try {
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
 * Create a new Circle member with magic link
 */
export async function createCircleMember(email: string, name: string): Promise<CircleMemberResponse> {
  try {
    const response = await makeCircleRequest<{ community_member: CircleMemberResponse }>(
      "/community_members",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          name,
          skip_invitation: false,
          send_magic_link: true,
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
 * Grant access to a Circle space
 */
export async function grantCircleSpaceAccess(memberId: string, spaceId: string): Promise<void> {
  try {
    await makeCircleRequest(
      "/space_members",
      {
        method: "POST",
        body: JSON.stringify({
          community_member_id: memberId,
          space_id: spaceId,
        }),
      }
    );
    console.log(`✅ Granted access to space: ${spaceId}`);
  } catch (error) {
    console.error("Error granting Circle access:", error);
    throw error;
  }
}

/**
 * Main function: Process Circle access (find/create member + grant access)
 * This is the primary function called from webhooks
 */
export async function processCircleAccess(
  email: string,
  name: string,
  spaceId?: string
): Promise<{ memberId: string; isNewMember: boolean }> {
  console.log(`🔄 Processing Circle access for: ${email}`);
  
  // Step 1: Check if member exists
  let member = await findCircleMemberByEmail(email);
  let isNewMember = false;

  // Step 2: Create member if doesn't exist
  if (!member) {
    console.log(`➕ Creating new Circle member: ${email}`);
    member = await createCircleMember(email, name);
    isNewMember = true;
  } else {
    console.log(`✓ Member already exists: ${email} (${member.id})`);
  }

  // Step 3: Grant access to space if provided
  if (spaceId) {
    console.log(`🔑 Granting access to space: ${spaceId}`);
    await grantCircleSpaceAccess(member.id, spaceId);
  }

  console.log(`✅ Circle access completed for: ${email}`);
  
  return {
    memberId: member.id,
    isNewMember,
  };
}
