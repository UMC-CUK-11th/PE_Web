"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/auth-store";
import { meOptions } from "../../api/private-query-options";
import { memberErrorMessage } from "../../api/api-client";
export function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.accessToken);
  const me = useQuery(meOptions());
  useEffect(() => { if (hydrated && !token) router.replace("/login"); }, [hydrated, token, router]);
  if (!hydrated || !token) return <main className="p-12 text-center" role="status">로그인 상태를 확인 중이에요.</main>;
  if (me.isLoading) return <main className="p-12 text-center" role="status">내 정보를 불러오는 중이에요.</main>;
  if (me.isError || !me.data) return <main className="min-h-[70vh] p-8 text-center"><p role="alert">{memberErrorMessage(me.error)}</p><button className="m-4 font-bold text-blue-700" onClick={() => void me.refetch()}>다시 시도</button><button onClick={() => useAuthStore.getState().setAccessToken(null)}>로그아웃</button></main>;
  return <div><nav aria-label="내 계정 메뉴" className="mx-auto flex max-w-5xl gap-5 px-5 pt-6 text-sm font-bold text-blue-700"><Link href="/mypage">마이페이지</Link><Link href="/mypage/edit">내 정보 수정</Link></nav>{children}</div>;
}
