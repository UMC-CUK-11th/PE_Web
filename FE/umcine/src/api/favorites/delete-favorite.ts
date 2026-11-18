import { authenticatedApiClient } from "../authenticated-api-client";

export async function deleteFavorite(movieId: number) {
  await authenticatedApiClient.delete(`favorites/${movieId}`);
}
