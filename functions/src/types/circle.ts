export interface CircleMember {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  name: string;
  member_tags: { name: string; id: number }[];
}

export interface CircleMemberNotFound {
  success: false;
  message: string;
  error_details: { message: string };
}

export interface CreateMemberResponse {
  message: string;
  community_member: CircleMember;
}

export interface GrantAccessResponse {
  success: boolean;
  message: string;
}

export interface CreateSpaceResponse {
  success: boolean;
  message: string;
  space: {
    id: string;
  };
}
