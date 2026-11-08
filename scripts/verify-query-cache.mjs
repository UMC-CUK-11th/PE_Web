import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const require = createRequire(new URL("FE/umcine/package.json", root));
const { createServer } = await import(pathToFileURL(require.resolve("vite")).href);
const apiFunctionCalls = [];
let server;
let client;
try {
  server = await createServer({ root: fileURLToPath(new URL("FE/umcine/", root)), logLevel: "silent", server: { middlewareMode: true, hmr: false } });
  client = (await server.ssrLoadModule("/src/config/query-client.ts")).queryClient;
  const { getMovies } = await server.ssrLoadModule("/src/api/movies/get-movies.ts");
  const query = (page) => ({ queryKey: ["movies", "list", { page }], queryFn: () => {
    apiFunctionCalls.push({ page, startedAt: new Date().toISOString() });
    return getMovies({ page });
  } });
  const first = await client.fetchQuery(query(1));
  const second = await client.fetchQuery(query(2));
  const back = await client.fetchQuery(query(1));
  assert.equal(first.page, 1);
  assert.equal(second.page, 2);
  assert.equal(back, first);
  assert.equal(apiFunctionCalls.length, 2);
  assert.equal(client.getDefaultOptions().queries.staleTime, 60000);
  assert.equal(client.getDefaultOptions().queries.gcTime, 300000);
  const evidence = { recordedAt: new Date().toISOString(), runtime: "Actual application QueryClient + API functions in Node/Vite SSR; browser Devtools not verified",
    navigation: [1, 2, 1], apiFunctionCalls, apiFunctionCallCount: apiFunctionCalls.length, cachedReturnReused: back === first,
    staleTime: 60000, gcTime: 300000,
    cache: client.getQueryCache().getAll().map((query) => ({ queryKey: query.queryKey, status: query.state.status, dataUpdatedAt: query.state.dataUpdatedAt })) };
  const directory = new URL("docs/evidence/week06/", root);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL("query-cache.json", directory), JSON.stringify(evidence, null, 2) + "\n");
  console.log(JSON.stringify({ ok: true, apiFunctionCalls: apiFunctionCalls.length, cacheEntries: client.getQueryCache().getAll().length, cachedReturnReused: true }));
} catch (error) {
  console.error(JSON.stringify({ ok: false, errorType: error.name, message: error instanceof assert.AssertionError ? error.message : "Cache verification failed", networkCode: error.cause?.code }));
  process.exitCode = 1;
} finally {
  client?.clear();
  await server?.close();
}
