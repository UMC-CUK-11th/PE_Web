import ky from "ky";
import { env } from "../config/env";

// Backend requests stay separate from TMDB and do not attach authentication.
export const apiClient = ky.create({
  baseUrl: `${env.backendApiBaseUrl}/`,
  retry: 0,
});
