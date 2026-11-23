import { authApi } from "./auth-api";

export const authenticatedApiClient = authApi.extend({
  retry: 0,
});
