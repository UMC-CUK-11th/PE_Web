import ky from "ky";

export const tmdbClient = ky.create({
  prefix: "/api/tmdb/",
});
