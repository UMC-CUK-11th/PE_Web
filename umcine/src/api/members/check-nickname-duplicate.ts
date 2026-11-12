import { apiClient } from "../api-client";
import type { ApiResponse } from "./models";
export interface CheckNicknameDuplicateResponse {
    available: boolean;
}
export async function checkNicknameDuplicate(nickname: string) {
    const response = await apiClient
        .get(`members/nickname/${encodeURIComponent(nickname)}`)
        .json<ApiResponse<CheckNicknameDuplicateResponse>>();
    return response.result;
}
