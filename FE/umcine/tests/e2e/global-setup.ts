export default async function setup() {
  if (process.env.E2E_LIVE_API !== "1") return;
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch("http://localhost:8080/members/email/e2e-readiness@example.com", { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
    } catch { /* 서버 기동을 기다립니다. */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Live API is not ready. Start BE/movie/scripts/start-e2e-backend.ps1 first.");
}
