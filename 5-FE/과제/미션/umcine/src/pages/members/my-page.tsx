import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useEffect, useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import {
  getMemberRatings,
  type MemberRating,
} from "../../api/members/get-member-ratings";
import { RequestStatus } from "../../components/request-status";

type CheckResult = { message: string; tone: "default" | "error" } | null;

function AvailabilityForm({
  label,
  placeholder,
  check,
}: {
  label: "닉네임" | "이메일";
  placeholder: string;
  check: (value: string) => Promise<{ available: boolean }>;
}) {
  const [value, setValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<CheckResult>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedValue = value.trim();
    if (!normalizedValue) {
      setResult({ message: `${label}을 입력해 주세요.`, tone: "error" });
      return;
    }
    setIsChecking(true);
    setResult(null);
    try {
      const { available } = await check(normalizedValue);
      setResult(
        available
          ? { message: `사용할 수 있는 ${label}이에요.`, tone: "default" }
          : { message: `이미 사용 중인 ${label}이에요.`, tone: "error" },
      );
    } catch {
      setResult({ message: `${label} 확인에 실패했어요.`, tone: "error" });
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold">{label} 중복 확인</h2>
      <div className="flex gap-3">
        <input
          aria-label={label}
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-4 py-2.5 outline-blue-600"
        />
        <button
          type="submit"
          disabled={isChecking}
          className="rounded-md bg-[#235ce8] px-5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isChecking ? "확인 중" : "확인"}
        </button>
      </div>
      {result && (
        <p
          role={result.tone === "error" ? "alert" : "status"}
          className={result.tone === "error" ? "mt-3 text-sm text-red-600" : "mt-3 text-sm text-[#235ce8]"}
        >
          {result.message}
        </p>
      )}
    </form>
  );
}

function MemberRatings() {
  const [memberIdText, setMemberIdText] = useState("1");
  const [memberId, setMemberId] = useState(1);
  const [ratings, setRatings] = useState<MemberRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setRatings([]);
    setErrorMessage(null);
    setIsLoading(true);
    getMemberRatings(memberId)
      .then((response) => {
        if (!ignore) setRatings(response);
      })
      .catch((error: unknown) => {
        if (ignore) return;
        setErrorMessage(
          isHTTPError(error) && error.response.status === 404
            ? "존재하지 않는 유저예요."
            : "평점 목록을 불러오지 못했어요.",
        );
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [memberId]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextMemberId = Number(memberIdText);
    if (!Number.isInteger(nextMemberId) || nextMemberId <= 0) {
      setErrorMessage("올바르지 않은 유저 번호예요.");
      setRatings([]);
      return;
    }
    setMemberId(nextMemberId);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">유저별 평점</h2>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 text-sm">
          <label htmlFor="member-id">유저 번호</label>
          <input
            id="member-id"
            inputMode="numeric"
            value={memberIdText}
            onChange={(event) => setMemberIdText(event.target.value)}
            className="w-20 rounded-md border border-slate-300 px-3 py-2 outline-blue-600"
          />
          <button type="submit" className="rounded-md bg-slate-800 px-4 py-2 font-semibold text-white">
            조회
          </button>
        </form>
      </div>
      {isLoading ? (
        <RequestStatus message="평점 목록을 불러오는 중이에요." />
      ) : errorMessage ? (
        <RequestStatus message={errorMessage} tone="error" />
      ) : ratings.length === 0 ? (
        <RequestStatus message="아직 남긴 평점이 없어요." />
      ) : (
        <ul aria-label="평점 목록" className="divide-y divide-slate-200">
          {ratings.map((rating) => (
            <li key={rating.ratingId} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(rating.movieId) }}
                className="font-semibold text-[#235ce8] hover:underline"
              >
                영화 #{rating.movieId}
              </Link>
              <span aria-label={`별점 ${rating.score}점`} className="text-amber-500">
                {"★".repeat(rating.score)}
                <span className="text-slate-300">{"★".repeat(5 - rating.score)}</span>
              </span>
              <p className="w-full text-sm text-slate-700 sm:w-auto sm:flex-1">
                {rating.comment ?? "코멘트 없음"}
              </p>
              <time dateTime={rating.createdAt} className="text-xs text-[#6a7081]">
                {rating.createdAt.slice(0, 10).replaceAll("-", ".")}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function MyPage() {
  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 py-8 sm:px-10">
      <h1 className="mb-7 text-2xl font-bold">내 정보</h1>
      <div className="grid gap-5 lg:grid-cols-2">
        <AvailabilityForm label="닉네임" placeholder="사용할 닉네임" check={checkNickname} />
        <AvailabilityForm label="이메일" placeholder="name@example.com" check={checkEmail} />
      </div>
      <div className="mt-5">
        <MemberRatings />
      </div>
    </main>
  );
}
