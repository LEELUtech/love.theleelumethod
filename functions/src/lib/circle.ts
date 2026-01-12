import { configs } from "../configs/env";

// Types
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
  error_details: {
    message: string;
  };
}

interface CreateMemberResponse {
  message: string;
  community_member: CircleMember;
}

interface GrantAccessResponse {
  success: boolean;
  message: string;
}

// Config
const getCircleConfig = () => ({
  apiKey: configs.circleApiKey || "PLACEHOLDER_API_KEY",
  baseUrl: "https://app.circle.so/api/admin/v2",
});

// Make Circle API request
async function makeCircleRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

  // For 404 on search endpoint, return JSON (not found response)
  if (!response.ok && response.status === 404) {
    return response.json();
  }

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Circle API Error: ${response.status} - ${errorData}`);
  }

  return response.json();
}

// Find member by email
export async function findCircleMemberByEmail(email: string): Promise<CircleMember | null> {
  console.log(`[Circle Search] Looking for email: ${email}`);

  const response = await makeCircleRequest<CircleMember | CircleMemberNotFound>(
    `/community_members/search?email=${encodeURIComponent(email)}`,
    { method: "GET" },
  );

  console.log("[Circle Search] Response:", JSON.stringify(response));

  if ("success" in response && response.success === false) {
    console.log("[Circle Search] Not found");
    return null;
  }

  return response as CircleMember;
}

// Create new member
export async function createCircleMember(email: string, name: string): Promise<CircleMember> {
  console.log(`[Circle] Creating member with email: ${email}, name: ${name}`);
  const response = await makeCircleRequest<CreateMemberResponse>("/community_members", {
    method: "POST",
    body: JSON.stringify({
      email,
      name,
      skip_invitation: false,
    }),
  });
  console.log(`[Circle] Member created: ${response.community_member.id}`);
  return response.community_member;
}

// Grant space access
export async function grantCircleSpaceAccess(email: string, spaceId: string): Promise<void> {
  const response = await makeCircleRequest<GrantAccessResponse>("/space_members", {
    method: "POST",
    body: JSON.stringify({
      email,
      space_id: parseInt(spaceId),
    }),
  });
  console.log(`[Circle] ${response.message}`);
}

// Grant course access
export async function grantCircleCourseAccess(email: string, courseId: string): Promise<void> {
  const response = await makeCircleRequest<GrantAccessResponse>("/course_members", {
    method: "POST",
    body: JSON.stringify({
      email,
      course_id: parseInt(courseId),
    }),
  });
  console.log(`[Circle] ${response.message}`);
}

// Main: Process Circle access
export async function processCircleAccess(
  email: string,
  name: string,
  spaceId?: string,
  courseId?: string,
): Promise<{ memberId: number; isNewMember: boolean }> {
  console.log(`[Circle] Processing access for: ${email}`);

  // Find or create member
  let member = await findCircleMemberByEmail(email);
  let isNewMember = false;

  console.log("MEMBER LOG313213", member);

  if (!member) {
    console.log(`[Circle] Member not found, creating: ${email}`);
    member = await createCircleMember(email, name);
    isNewMember = true;
  } else {
    console.log(`[Circle] Member exists: ${email} (${member.id})`);
  }

  // Grant access
  if (spaceId) {
    console.log(`[Circle] Granting space access to: ${email}`);
    await grantCircleSpaceAccess(email, spaceId);
  }

  if (courseId) {
    console.log(`[Circle] Granting course access to: ${email}`);
    await grantCircleCourseAccess(email, courseId);
  }

  console.log(`[Circle] Access completed: ${email}`);

  return {
    memberId: member.id,
    isNewMember,
  };
}
