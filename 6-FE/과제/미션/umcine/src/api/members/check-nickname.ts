import { umcClient } from "../umc-client";

interface CheckNicknameResponse {
  available: boolean;
}

function checkNickname(nickname: string) {
  return umcClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameResponse>();
}

export { checkNickname, type CheckNicknameResponse };
