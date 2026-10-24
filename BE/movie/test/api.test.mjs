import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createTestApp } from "./test-app.mjs";
import { DataSource } from "typeorm";
import { Member } from "../dist/entity/member.entity.js";
import { Rating } from "../dist/entity/rating.entity.js";

let app;
let base;
before(async () => {
  app = await createTestApp();
  base = await app.getUrl();
});
after(async () => {
  await app?.close();
});
const get = (path, options) => fetch(`${base}${path}`, options);

test("duplicate nickname and email; available nickname and email", async () => {
  for (const [path, available] of [
    ["/members/nickname/수현", false],
    ["/members/nickname/꿀범", true],
    ["/members/email/noco@umc.com", false],
    ["/members/email/new@umc.com", true],
  ]) {
    const response = await get(path);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { available });
  }
});

test("ratings use DTO, descending IDs, and do not leak member/password", async () => {
  const response = await get("/members/1/ratings");
  assert.equal(response.status, 200);
  const ratings = await response.json();
  assert.deepEqual(
    ratings.map((rating) => rating.ratingId),
    [2, 1],
  );
  assert.equal(ratings[0].movieId, 155);
  assert.deepEqual(
    Object.keys(ratings[0]).sort(),
    [
      "ratingId",
      "movieId",
      "score",
      "comment",
      "createdAt",
      "updatedAt",
    ].sort(),
  );
});

test("existing member with no ratings returns [], missing member returns 404", async () => {
  assert.deepEqual(await (await get("/members/3/ratings")).json(), []);
  const missing = await get("/members/999/ratings");
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).message, "존재하지 않는 유저입니다.");
});

test("invalid params are rejected with 400", async () => {
  for (const path of [
    "/members/nickname/a",
    "/members/nickname/abcdefghijklmnop",
    "/members/email/invalid",
    "/members/abc/ratings",
    "/members/0/ratings",
    "/members/-1/ratings",
    "/members/9007199254740992/ratings",
  ]) {
    assert.equal((await get(path)).status, 400, path);
  }
});

test("CORS allows localhost:5173 and provides preflight methods", async () => {
  const response = await get("/members/1/ratings", {
    headers: { Origin: "http://localhost:5173" },
  });
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "http://localhost:5173",
  );
  const preflight = await get("/members/1/ratings", {
    method: "OPTIONS",
    headers: {
      Origin: "http://localhost:5173",
      "Access-Control-Request-Method": "GET",
    },
  });
  assert.equal(preflight.status, 204);
  assert.equal(
    preflight.headers.get("access-control-allow-methods"),
    "GET,POST,PATCH,DELETE",
  );
  const otherOrigin = await get("/members/1/ratings", {
    headers: { Origin: "http://example.com" },
  });
  assert.notEqual(
    otherOrigin.headers.get("access-control-allow-origin"),
    "http://example.com",
  );
});

test("CORS learning mode removes allow-origin header", async () => {
  const withoutCors = await createTestApp({ corsEnabled: false });
  try {
    const response = await fetch(
      `${await withoutCors.getUrl()}/members/1/ratings`,
      { headers: { Origin: "http://localhost:5173" } },
    );
    assert.equal(response.headers.get("access-control-allow-origin"), null);
  } finally {
    await withoutCors.close();
  }
});

test("MySQL entity metadata has one member FK and no movie FK", async () => {
  const source = new DataSource({
    type: "mysql",
    database: "umc_movie",
    entities: [Member, Rating],
    synchronize: false,
  });
  await source.buildMetadatas();
  const metadata = source.getMetadata(Rating);
  assert.deepEqual(
    metadata.foreignKeys.map((key) => key.columnNames),
    [["member_id"]],
  );
  assert.ok(
    metadata.indices.some(
      (index) => index.name === "uk_rating_member_movie" && index.isUnique,
    ),
  );
});
