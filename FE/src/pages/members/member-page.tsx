import { useState, type SubmitEvent } from "react";
import { memberApiUrl, requestMemberApi, type AvailabilityResponse, type RatingResponse } from "../../api/members";

interface Result { url: string; data?: AvailabilityResponse | RatingResponse[]; error?: string }
function ApiForm({ title, label, initialValue, kind }: { title: string; label: string; initialValue: string; kind: "nickname" | "email" | "ratings" }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("value") ?? "").trim();
    if (!value || (kind === "ratings" && !/^[1-9]\d*$/.test(value))) return;
    const path = kind === "ratings" ? `/members/${encodeURIComponent(value)}/ratings` : `/members/${kind}/${encodeURIComponent(value)}`;
    const url = memberApiUrl(path);
    setLoading(true);
    setResult(null);
    try {
      const data = await requestMemberApi<AvailabilityResponse | RatingResponse[]>(path);
      setResult({ url, data });
    } catch (error) {
      setResult({ url, error: error instanceof TypeError ? "서버에 연결하지 못했어요. 백엔드 실행 상태와 CORS 설정을 확인해 주세요." : error instanceof Error ? error.message : "요청에 실패했어요." });
    } finally { setLoading(false); }
  }
  return (
    <section className="rounded-xl border border-gray-700 bg-[#1f2128] p-6">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
        <label className="min-w-0 flex-1 text-sm text-gray-300">{label}
          <input name="value" defaultValue={initialValue} required type={kind === "email" ? "email" : kind === "ratings" ? "number" : "text"} min={kind === "ratings" ? 1 : undefined} step={kind === "ratings" ? 1 : undefined} maxLength={kind === "nickname" ? 50 : undefined} className="mt-2 block w-full rounded border border-gray-600 bg-[#141517] px-4 py-3 text-white focus:border-red-500" />
        </label>
        <button disabled={loading} className="rounded bg-[#e50914] px-5 py-3 font-bold disabled:opacity-50">{loading ? "조회 중…" : "조회"}</button>
      </form>
      <div aria-live="polite" className="mt-5">
        {loading && <p role="status">서버 응답을 기다리고 있어요.</p>}
        {result && <>
          <p className="break-all font-mono text-xs text-gray-400">GET {result.url}</p>
          {result.error ? <p role="alert" className="mt-3 text-red-400">{result.error}</p> : <>
            <p className="mt-3 font-bold text-green-400">{Array.isArray(result.data) ? `평점 ${result.data.length}개` : result.data?.available ? "사용할 수 있어요." : "이미 사용 중이에요."}</p>
            <pre className="mt-3 overflow-auto rounded bg-[#141517] p-4 text-sm text-gray-200">{JSON.stringify(result.data, null, 2)}</pre>
          </>}
        </>}
      </div>
    </section>
  );
}
export function MemberPage() {
  return (
    <main className="mx-auto max-w-[1000px] space-y-6 px-5 py-8">
      <div><h1 className="text-3xl font-bold">회원 · 평점</h1><p className="mt-3 text-gray-400">닉네임과 이메일의 사용 가능 여부, 회원별 영화 평점을 확인해 보세요.</p></div>
      <ApiForm title="닉네임 중복 확인" label="닉네임" initialValue="수현" kind="nickname" />
      <ApiForm title="이메일 중복 확인" label="이메일" initialValue="noco@umc.com" kind="email" />
      <ApiForm title="회원별 평점 조회" label="회원 번호" initialValue="1" kind="ratings" />
    </main>
  );
}
