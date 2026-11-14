import type { ApiResponse } from "../models";

export interface CheckResponse {
  available: boolean;
}

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

export type SignupResponse = ApiResponse<{
  memberId: number;
  email: string;
  nickname: string;
}>;

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}
