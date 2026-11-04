import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { checkEmail, checkNickname, getMemberRatings, type MemberRating } from "../../api/members";

export function MemberPage() {
  const [nickname, setNickname] = useState("수현");
  const [email, setEmail] = useState("noco@umc.com");
  const [memberId, setMemberId] = useState("1");
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<MemberRating[] | null>(null);

  async function check(kind: "nickname" | "email") {
    const value = (kind === "nickname" ? nickname : email).trim();
    if (!value) { setMessages((prev) => ({ ...prev, [kind]: "값을 입력해 주세요." })); return; }
    setMessages((prev) => ({ ...prev, [kind]: "확인 중이에요." }));
    try {
      const response = await (kind === "nickname" ? checkNickname(value) : checkEmail(value));
      setMessages((prev) => ({ ...prev, [kind]: response.available ? "사용할 수 있어요." : "이미 사용 중이에요." }));
    } catch {
      setMessages((prev) => ({ ...prev, [kind]: "확인하지 못했어요. 잠시 후 다시 시도해 주세요." }));
    }
  }

  async function loadRatings() {
    const id = Number(memberId);
    setRatings(null);
    if (!Number.isInteger(id) || id <= 0) {
      setMessages((prev) => ({ ...prev, ratings: "올바른 회원 번호를 입력해 주세요." })); return;
    }
    setMessages((prev) => ({ ...prev, ratings: "평점을 불러오는 중이에요." }));
    try {
      const response = await getMemberRatings(id);
      setRatings(response);
      setMessages((prev) => ({ ...prev, ratings: response.length ? "최신순 평점 목록이에요." : "등록한 평점이 없어요." }));
    } catch {
      setMessages((prev) => ({ ...prev, ratings: "회원을 찾을 수 없거나 평점을 불러오지 못했어요." }));
    }
  }

  return <main className="mx-auto min-h-[70vh] max-w-[900px] px-6 py-8">
    <h1 className="mb-6 text-2xl font-bold">회원 정보 확인</h1>
    <div className="grid gap-6 sm:grid-cols-2">
      <form className="rounded border border-gray-200 bg-white p-5" onSubmit={(event) => { event.preventDefault(); void check("nickname"); }}>
        <label className="mb-3 block font-semibold" htmlFor="nickname">닉네임 중복 확인</label>
        <input id="nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} className="mb-3 w-full rounded border p-2" />
        <button type="submit" className="rounded bg-[#536be8] px-4 py-2 text-white">닉네임 확인</button>
        <p className="mt-3 text-sm" role="status">{messages.nickname}</p>
      </form>
      <form className="rounded border border-gray-200 bg-white p-5" onSubmit={(event) => { event.preventDefault(); void check("email"); }}>
        <label className="mb-3 block font-semibold" htmlFor="email">이메일 중복 확인</label>
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mb-3 w-full rounded border p-2" />
        <button type="submit" className="rounded bg-[#536be8] px-4 py-2 text-white">이메일 확인</button>
        <p className="mt-3 text-sm" role="status">{messages.email}</p>
      </form>
    </div>
    <section className="mt-6 rounded border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold">회원별 평점 조회</h2>
      <form className="flex flex-wrap items-end gap-3" onSubmit={(event) => { event.preventDefault(); void loadRatings(); }}>
        <label htmlFor="member-id">회원 번호<input id="member-id" type="number" min="1" value={memberId} onChange={(event) => setMemberId(event.target.value)} className="ml-3 w-24 rounded border p-2" /></label>
        <button type="submit" className="rounded bg-[#536be8] px-4 py-2 text-white">평점 조회</button>
      </form>
      <p className="my-4 text-sm" role="status">{messages.ratings}</p>
      <ul className="space-y-3">{ratings?.map((rating) => <li key={rating.ratingId} className="rounded bg-gray-50 p-4">
        <Link to="/movies/$movieId" params={{ movieId: String(rating.movieId) }} className="font-semibold text-[#536be8]">영화 #{rating.movieId}</Link>
        <span className="ml-3">별점 {rating.score} / 5</span>
        <p className="my-2">{rating.comment || "후기 없음"}</p>
        <time className="text-xs text-gray-500" dateTime={rating.createdAt}>{rating.createdAt.replace("T", " ")}</time>
      </li>)}</ul>
    </section>
  </main>;
}
