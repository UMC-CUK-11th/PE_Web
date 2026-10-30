import { useState } from "react";
import type { FormEvent } from "react";
import { checkEmail, checkNickname, getMemberRatings } from "../../api/member-client";
import type { CheckResponse, RatingResponse } from "../../api/member-client";

const inputStyle = "min-w-0 flex-1 rounded-lg border border-[#dfe2e9] bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const buttonStyle = "shrink-0 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-50";

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "요청에 실패했어요. 다시 시도해 주세요.";
}

function JsonResult({ value }: { value: unknown }) {
  return (
    <details className="mt-4 text-xs text-slate-500">
      <summary className="cursor-pointer">응답 JSON 보기</summary>
      <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
        {JSON.stringify(value, null, 2)}
      </pre>
    </details>
  );
}

function AvailabilityForm({ kind }: { kind: "nickname" | "email" }) {
  const isNickname = kind === "nickname";
  const label = isNickname ? "닉네임" : "이메일";
  const [value, setValue] = useState(isNickname ? "수현" : "noco@umc.com");
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      setResult(await (isNickname ? checkNickname(value.trim()) : checkEmail(value.trim())));
    } catch (error) {
      setError(messageOf(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#e7e8ec] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">{label} 중복 확인</h2>
      <p className="mt-2 text-sm text-slate-500">사용하고 싶은 {label}을 확인해 보세요.</p>
      <form onSubmit={submit} className="mt-5">
        <label htmlFor={kind} className="mb-2 block text-sm font-semibold">{label}</label>
        <div className="flex gap-2">
          <input id={kind} className={inputStyle} type={isNickname ? "text" : "email"}
            required maxLength={isNickname ? 50 : 254} value={value} disabled={loading}
            onChange={(event) => { setValue(event.target.value); setResult(null); setError(""); }} />
          <button className={buttonStyle} disabled={loading || !value.trim()}>
            {loading ? "확인 중…" : "중복 확인"}
          </button>
        </div>
      </form>
      <div aria-live="polite" className="mt-4 text-sm">
        {error && <p role="alert" className="text-red-600">{error}</p>}
        {result && <p className={result.available ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>
          {result.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`}
        </p>}
      </div>
      {result && <JsonResult value={result} />}
    </section>
  );
}

function formatDate(value: string) {
  return value.replace("T", " ").slice(0, 19);
}

export function MembersPage() {
  const [memberId, setMemberId] = useState("1");
  const [ratings, setRatings] = useState<RatingResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[1-9]\d*$/.test(memberId)) {
      setError("회원 번호는 1 이상의 정수로 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError("");
    setRatings(null);
    try {
      setRatings(await getMemberRatings(memberId));
    } catch (error) {
      setError(messageOf(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-160px)] max-w-5xl px-4 py-10 md:px-8 md:py-14">
      <p className="text-xs font-bold tracking-widest text-blue-600">UMCINE MEMBERS</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">회원과 평점</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">닉네임과 이메일 사용 가능 여부를 확인하고, 회원이 남긴 영화 평점을 찾아보세요.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <AvailabilityForm kind="nickname" />
        <AvailabilityForm kind="email" />
      </div>
      <section className="mt-6 rounded-2xl border border-[#e7e8ec] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold">회원별 영화 평점</h2>
          <span className="text-xs text-slate-500">최근 등록한 평점부터 표시해요</span>
        </div>
        <form onSubmit={submit} className="mt-5 max-w-md">
          <label htmlFor="member-id" className="mb-2 block text-sm font-semibold">회원 번호</label>
          <div className="flex gap-2">
            <input id="member-id" className={inputStyle} type="number" min="1" step="1" required
              value={memberId} disabled={loading}
              onChange={(event) => { setMemberId(event.target.value); setRatings(null); setError(""); }} />
            <button className={buttonStyle} disabled={loading}>{loading ? "불러오는 중…" : "평점 조회"}</button>
          </div>
        </form>
        <div aria-live="polite" className="mt-6">
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          {ratings === null && !loading && !error && <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">회원 번호를 입력하고 평점을 조회해 보세요.</p>}
          {ratings && <p className="mb-4 text-sm font-semibold text-slate-600">평점 {ratings.length}개</p>}
          {ratings?.length === 0 && <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">아직 남긴 평점이 없어요.</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            {ratings?.map((rating) => (
              <article key={rating.ratingId} className="rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold">영화 #{rating.movieId}</h3>
                  <span className="text-sm font-bold text-amber-600" aria-label={`별점 ${rating.score}점`}>★ {rating.score} / 5</span>
                </div>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{rating.comment || "작성한 코멘트가 없어요."}</p>
                <p className="mt-4 text-xs text-slate-400">작성 {formatDate(rating.createdAt)}</p>
                <p className="mt-1 text-xs text-slate-400">수정 {formatDate(rating.updatedAt)}</p>
              </article>
            ))}
          </div>
        </div>
        {ratings && <JsonResult value={ratings} />}
      </section>
    </main>
  );
}
