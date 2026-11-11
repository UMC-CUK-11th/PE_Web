import { authenticatedApiClient } from "../authenticated-api-client";
import type { Rating } from "./models";

export function getMemberRatings(memberId: number) {
  return authenticatedApiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}
