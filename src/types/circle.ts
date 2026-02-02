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
