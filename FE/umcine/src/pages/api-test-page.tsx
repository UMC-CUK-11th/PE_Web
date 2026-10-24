import { useState, type FormEvent } from "react";
import { isHTTPError } from "ky";
import {
  checkEmail,
  checkNickname,
  getMemberRatings,
  type RatingResponse,
} from "../api/members";

export function ApiTestPage() {
  return (
    <main className="mx-auto min-h-[75vh] max-w-3xl space-y-6 px-5 py-10">
      <h1 className="text-2xl font-bold">Backend API 확인</h1>
      <p className="text-sm text-zinc-500">
        로컬 영화 서버의 닉네임·이메일 중복 확인과 평점 조회를 실행합니다.
      </p>
      <AvailabilityForm kind="nickname" />
      <AvailabilityForm kind="email" />
      <RatingsForm />
    </main>
  );
}

function AvailabilityForm({ kind }: { kind: "nickname" | "email" }) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const label = kind === "nickname" ? "닉네임" : "이메일";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(
      new FormData(event.currentTarget).get("value") ?? "",
    ).trim();
    setLoading(true);
    setResult("");
    try {
      const data = await (kind === "nickname"
        ? checkNickname(value)
        : checkEmail(value));
      setResult(data.available ? "사용 가능" : "중복");
    } catch (error) {
      setResult(await backendError(error));
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-zinc-200 bg-white p-5"
    >
      <label htmlFor={kind} className="mb-3 block font-semibold">
        {label} 중복 확인
      </label>
      <div className="flex gap-3">
        <input
          id={kind}
          name="value"
          type={kind === "email" ? "email" : "text"}
          required
          minLength={kind === "nickname" ? 2 : undefined}
          maxLength={kind === "nickname" ? 12 : 254}
          defaultValue={kind === "nickname" ? "수현" : "noco@umc.com"}
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2"
        />
        <button
          disabled={loading}
          className="rounded-lg bg-zinc-950 px-4 py-2 text-white disabled:opacity-50"
        >
          중복 확인
        </button>
      </div>
      <p role="status" className="mt-3 text-sm">
        {loading ? "확인 중…" : result}
      </p>
    </form>
  );
}

function RatingsForm() {
  const [ratings, setRatings] = useState<RatingResponse[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const memberId = Number(new FormData(event.currentTarget).get("memberId"));
    if (!Number.isSafeInteger(memberId) || memberId <= 0) {
      setMessage("올바르지 않은 유저 번호입니다.");
      return;
    }
    setLoading(true);
    setRatings([]);
    setMessage("");
    try {
      const data = await getMemberRatings(memberId);
      setRatings(data);
      setMessage(data.length ? `평점 ${data.length}개` : "남긴 평점이 없어요.");
    } catch (error) {
      setMessage(await backendError(error));
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-zinc-200 bg-white p-5"
    >
      <label htmlFor="memberId" className="mb-3 block font-semibold">
        Member ID 평점 조회
      </label>
      <div className="flex gap-3">
        <input
          id="memberId"
          name="memberId"
          type="number"
          min="1"
          step="1"
          required
          defaultValue="1"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2"
        />
        <button
          disabled={loading}
          className="rounded-lg bg-zinc-950 px-4 py-2 text-white disabled:opacity-50"
        >
          평점 조회
        </button>
      </div>
      <p role="status" className="mt-3 text-sm">
        {loading ? "조회 중…" : message}
      </p>
      <ul className="mt-3 space-y-3">
        {ratings.map((rating) => (
          <li
            key={rating.ratingId}
            className="rounded-xl bg-zinc-100 p-4 text-sm"
          >
            <p>
              영화 {rating.movieId} · 평점 {rating.score}
            </p>
            <p className="mt-1">{rating.comment || "코멘트 없음"}</p>
            <time
              className="mt-1 block text-xs text-zinc-500"
              dateTime={rating.createdAt}
            >
              {new Date(rating.createdAt).toLocaleString("ko-KR")}
            </time>
          </li>
        ))}
      </ul>
    </form>
  );
}

async function backendError(error: unknown): Promise<string> {
  if (isHTTPError(error)) {
    const fallback = `요청 실패 (${error.response.status})`;
    {
      // Ky 2 consumes the response body while populating error.data.
      const body: unknown = error.data;
      if (typeof body === "object" && body !== null && "message" in body) {
        const message = body.message;
        if (typeof message === "string") return message;
        if (
          Array.isArray(message) &&
          message.every((item) => typeof item === "string")
        )
          return message.join(", ");
      }
    }
    return fallback;
  }
  return "서버에 연결하지 못했어요. 서버 실행 상태와 CORS 설정을 확인해주세요.";
}
