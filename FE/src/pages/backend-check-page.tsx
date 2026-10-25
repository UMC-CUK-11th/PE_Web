import { useState, type SubmitEvent } from "react";

const API_BASE_URL = "http://localhost:8080";

function ApiCheck({ title, label, initialValue, path }: {
  title: string;
  label: string;
  initialValue: string;
  path: (value: string) => string;
}) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>();
  const [error, setError] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim() || loading) return;
    setLoading(true);
    setError(false);
    setResult(undefined);
    try {
      const response = await fetch(API_BASE_URL + path(encodeURIComponent(value.trim())));
      const body: unknown = await response.json();
      setError(!response.ok);
      setResult(`HTTP ${response.status}\n${JSON.stringify(body, null, 2)}`);
    } catch {
      setError(true);
      setResult("백엔드에 연결하지 못했어요. 서버 실행 상태와 CORS 설정을 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <h2 className="mb-4 text-xl font-bold">{title}</h2>
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
      <label className="flex flex-1 flex-col gap-2 text-sm">
        {label}
        <input aria-label={label} value={value} onChange={(event) => setValue(event.target.value)}
          required className="rounded-md border border-gray-300 px-3 py-2" />
      </label>
      <button disabled={loading || !value.trim()} className="self-end rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-40">
        {loading ? "요청 중..." : title}
      </button>
    </form>
    {result && <pre role={error ? "alert" : "status"} className="mt-4 overflow-auto whitespace-pre-wrap rounded-md bg-gray-100 p-4 text-sm">{result}</pre>}
  </section>;
}

const nicknamePath = (value: string) => `/members/nickname/${value}`;
const emailPath = (value: string) => `/members/email/${value}`;
const ratingsPath = (value: string) => `/members/${value}/ratings`;

export function BackendCheckPage() {
  return <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
    <h1 className="text-3xl font-bold">회원 · 평점 API 확인</h1>
    <p className="text-gray-500">5주차 백엔드 연동 확인 화면입니다. UMCine에서 실제 서버에 요청합니다.</p>
    <ApiCheck title="닉네임 중복 확인" label="닉네임" initialValue="수현" path={nicknamePath} />
    <ApiCheck title="이메일 중복 확인" label="이메일" initialValue="noco@umc.com" path={emailPath} />
    <ApiCheck title="평점 조회" label="회원 ID" initialValue="1" path={ratingsPath} />
  </main>;
}
