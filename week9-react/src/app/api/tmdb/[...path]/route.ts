import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;

  const baseUrl = process.env.TMDB_API_BASE_URL;
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!baseUrl || !token) {
    return NextResponse.json(
      { error: "TMDB 환경 변수가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const url = new URL(
    `${baseUrl.replace(/\/$/, "")}/${path.join("/")}`,
  );

  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { error: "TMDB API 요청에 실패했습니다." },
      { status: 502 },
    );
  }
}
