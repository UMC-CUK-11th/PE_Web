import { apiClient } from "../api-client";
import type { ApiResponse } from "./models";
export interface CheckEmailDuplicateResponse {
    available: boolean;
}
export async function checkEmailDuplicate(email: string) {
    const response = await apiClient
        .get(`members/email/${encodeURIComponent(email)}`)
        .json<ApiResponse<CheckEmailDuplicateResponse>>();
    return response.result;
}
