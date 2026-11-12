import { apiClient } from "../api-client";
import type { ApiResponse } from "./models";
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
export function signup(body: SignupRequest) {
    return apiClient.post("members", { json: body }).json<SignupResponse>();
}
