import { umcClient } from "../umc-client";

interface CheckEmailResponse {
  available: boolean;
}

function checkEmail(email: string) {
  return umcClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckEmailResponse>();
}

export { checkEmail, type CheckEmailResponse };
