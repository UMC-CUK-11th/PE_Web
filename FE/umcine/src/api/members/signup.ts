import { apiClient } from "../api-client";
import type { SignupRequest, SignupResponse } from "./models";

export async function signup({ email, nickname, password }: SignupRequest) {
  // Whitelist the payload so confirmation and other form state cannot leak.
  const response = await apiClient
    .post("members", { json: { email, nickname, password } })
    .json<SignupResponse>();
  if (!response.isSuccess) {
    throw new Error(
      response.message || "회원가입에 실패했어요. 다시 시도해 주세요.",
    );
  }
  return response;
}
