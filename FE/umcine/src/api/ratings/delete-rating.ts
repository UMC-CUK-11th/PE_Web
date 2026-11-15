import { authenticatedApiClient } from "../authenticated-api-client";

export async function deleteRating(ratingId: number) {
  // 응답 본문 없이도 완료되도록 200과 204 모두 처리합니다.
  await authenticatedApiClient.delete(`ratings/${ratingId}`);
}
