// Optional DOM tests: install jsdom under .verification/week07-test-runtime (see WEEK07_FRONTEND_IMPLEMENTATION.md).
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { JSDOM } from "../.verification/week07-test-runtime/node_modules/jsdom/lib/api.js";
import { createServer } from "../FE/umcine/node_modules/vite/dist/node/index.js";

const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  { url: "http://localhost:5173/signup", pretendToBeVisual: true },
);
for (const key of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLInputElement",
  "Event",
  "MouseEvent",
  "MutationObserver",
  "requestAnimationFrame",
  "cancelAnimationFrame",
]) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value:
      typeof dom.window[key] === "function" && key.endsWith("AnimationFrame")
        ? dom.window[key].bind(dom.window)
        : dom.window[key],
  });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
process.env.VITE_BACKEND_API_BASE_URL = "http://localhost:3000";
const requests = [];
let available = true;
let failSignup = false;
let hold = false;
let release;
globalThis.fetch = async (input, init) => {
  const request = new Request(input, init);
  const body = request.method === "POST" ? await request.json() : null;
  requests.push({ url: request.url, method: request.method, body });
  if (hold)
    await new Promise((resolve) => {
      release = resolve;
    });
  const payload =
    request.method === "POST"
      ? {
          isSuccess: !failSignup,
          code: failSignup ? "MEMBER409" : "COMMON201",
          message: failSignup
            ? "테스트 회원가입 실패"
            : "회원가입에 성공했습니다.",
          result: failSignup
            ? null
            : { memberId: 1, email: body.email, nickname: body.nickname },
        }
      : { available };
  return new Response(JSON.stringify(payload), {
    status: failSignup && request.method === "POST" ? 409 : 200,
    headers: { "content-type": "application/json" },
  });
};
const React = await import("../FE/umcine/node_modules/react/index.js");
const { createRoot } =
  await import("../FE/umcine/node_modules/react-dom/client.js");
const routerApi =
  await import("../FE/umcine/node_modules/@tanstack/react-router/dist/esm/index.js");
const { act } = React;
const server = await createServer({
  root: fileURLToPath(new URL("../FE/umcine/", import.meta.url)),
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});
let root;
try {
  const { SignupPage } = await server.ssrLoadModule(
    "/src/pages/auth/signup-page.tsx",
  );
  const { LoginPage } = await server.ssrLoadModule(
    "/src/pages/auth/login-page.tsx",
  );
  const { MyPage } = await server.ssrLoadModule("/src/pages/my/my-page.tsx");
  const { MyEditPage } = await server.ssrLoadModule(
    "/src/pages/my/my-edit-page.tsx",
  );
  const rootRoute = routerApi.createRootRoute({ component: routerApi.Outlet });
  const routes = [
    ["/signup", SignupPage],
    ["/login", LoginPage],
    ["/my", MyPage],
    ["/my/edit", MyEditPage],
  ].map(([path, component]) =>
    routerApi.createRoute({ getParentRoute: () => rootRoute, path, component }),
  );
  const router = routerApi.createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: routerApi.createMemoryHistory({ initialEntries: ["/signup"] }),
    defaultPendingMinMs: 0,
  });
  root = createRoot(document.getElementById("root"));
  await act(async () => {
    await router.load();
    root.render(
      React.createElement(
        routerApi.RouterContextProvider,
        { router },
        React.createElement(SignupPage),
      ),
    );
  });
  const query = (selector) => {
    const element = document.querySelector(selector);
    assert.ok(element, selector);
    return element;
  };
  async function type(id, value) {
    await act(async () => {
      const element = query(`#${id}`);
      Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      ).set.call(element, value);
      element.dispatchEvent(new window.Event("input", { bubbles: true }));
    });
  }
  async function click(element) {
    await act(async () => {
      element.click();
    });
  }
  const submit = () => query('button[type="submit"]');
  const duplicateButton = (id) =>
    query(`#${id}`).parentElement.querySelector("button");
  const text = () => document.body.textContent;

  assert.equal(submit().disabled, true);
  assert.ok(!text().includes("올바른 이메일 형식을 입력해주세요."));
  assert.ok(!text().includes("비밀번호가 일치하지 않습니다."));
  await type("signup-email", "wrong");
  assert.ok(text().includes("올바른 이메일 형식을 입력해주세요."));
  assert.equal(duplicateButton("signup-email").disabled, true);
  await type("signup-nickname", "가");
  assert.ok(text().includes("닉네임은 2자 이상 12자 이하로 입력해주세요."));
  await type("signup-nickname", "가".repeat(13));
  assert.equal(duplicateButton("signup-nickname").disabled, true);
  await type("signup-password", "invalid");
  assert.equal(query("#signup-password").getAttribute("aria-invalid"), "true");
  await type("signup-password-confirm", "different");
  assert.ok(text().includes("비밀번호가 일치하지 않습니다."));
  console.log(
    "PASS UI: initial state, invalid email/nickname/password/confirmation, disabled controls",
  );

  await type("signup-email", "test@umc.com");
  available = false;
  await click(duplicateButton("signup-email"));
  assert.ok(text().includes("이미 사용 중인 이메일입니다."));
  assert.equal(submit().disabled, true);
  available = true;
  hold = true;
  await click(duplicateButton("signup-email"));
  assert.equal(query("#signup-email").disabled, true);
  assert.equal(duplicateButton("signup-email").disabled, true);
  assert.equal(duplicateButton("signup-email").textContent.trim(), "확인 중");
  await act(async () => {
    release();
  });
  hold = false;
  assert.ok(text().includes("사용 가능한 이메일입니다."));
  await type("signup-nickname", "테스트");
  await click(duplicateButton("signup-nickname"));
  await type("signup-password", "Test1234!");
  await type("signup-password-confirm", "Test1234!");
  assert.equal(submit().disabled, false);
  await type("signup-email", "changed@umc.com");
  assert.equal(submit().disabled, true);
  assert.ok(!text().includes("사용 가능한 이메일입니다."));
  await type("signup-email", "test@umc.com");
  assert.equal(submit().disabled, true);
  await click(duplicateButton("signup-email"));
  await type("signup-nickname", "새닉네임");
  assert.equal(submit().disabled, true);
  await click(duplicateButton("signup-nickname"));
  assert.equal(submit().disabled, false);
  console.log(
    "PASS UI: duplicate used/available, pending lock, both value changes invalidate approval including changing back",
  );

  failSignup = true;
  await click(submit());
  assert.ok(text().includes("테스트 회원가입 실패"));
  assert.equal(query("#signup-password").value, "Test1234!");
  assert.equal(query("#signup-email").value, "test@umc.com");
  assert.equal(submit().disabled, false);
  failSignup = false;
  hold = true;
  const before = requests.filter((request) => request.method === "POST").length;
  await click(submit());
  assert.equal(submit().disabled, true);
  assert.equal(submit().textContent.trim(), "가입 중");
  assert.equal(query("fieldset").disabled, true);
  await act(async () => {
    query("form").dispatchEvent(
      new window.Event("submit", { bubbles: true, cancelable: true }),
    );
  });
  assert.equal(
    requests.filter((request) => request.method === "POST").length,
    before + 1,
  );
  await act(async () => {
    release();
  });
  hold = false;
  assert.ok(text().includes("회원가입에 성공했습니다."));
  assert.deepEqual(Object.keys(requests.at(-1).body).sort(), [
    "email",
    "nickname",
    "password",
  ]);
  console.log(
    "PASS UI: signup failure preserves fields, retry, pending guard, success message, exact request payload",
  );

  await act(async () => {
    root.render(
      React.createElement(
        routerApi.RouterContextProvider,
        { router },
        React.createElement(LoginPage),
      ),
    );
  });
  const requestCount = requests.length;
  await type("login-email", "test@umc.com");
  await type("login-password", "Test1234!");
  await click(query("form button"));
  assert.ok(text().includes("로그인 기능을 준비 중이에요."));
  assert.equal(requests.length, requestCount);
  await act(async () => {
    root.render(
      React.createElement(
        routerApi.RouterContextProvider,
        { router },
        React.createElement(MyPage),
      ),
    );
  });
  assert.ok(text().includes("영화산책"));
  assert.ok(query('a[href="/my/edit"]'));
  await act(async () => {
    root.render(
      React.createElement(
        routerApi.RouterContextProvider,
        { router },
        React.createElement(MyEditPage),
      ),
    );
  });
  await type("edit-nickname", "가");
  assert.equal(query("form button").disabled, true);
  await type("edit-nickname", "수정테스트");
  await click(query("form button"));
  assert.ok(text().includes("수정테스트님"));
  assert.ok(text().includes("실제 회원 정보는 변경되지 않아요."));
  assert.equal(requests.length, requestCount);
  console.log(
    "PASS UI: login controlled inputs, profile view, edit validation/local preview; no login/me/PATCH requests",
  );
} finally {
  if (root)
    await act(async () => {
      root.unmount();
    });
  await server.close();
  dom.window.close();
}
