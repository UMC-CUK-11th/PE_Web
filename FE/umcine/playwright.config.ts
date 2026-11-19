import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://localhost:5173", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: "npm run dev -- --host localhost --port 5173 --strictPort",
    url: "http://localhost:5173/signup",
    reuseExistingServer: !process.env.CI,
    env: { VITE_API_BASE_URL: "http://localhost:8080", VITE_TMDB_ACCESS_TOKEN: "e2e-placeholder-not-a-real-token" },
  },
});
