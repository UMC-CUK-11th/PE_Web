interface AvailabilityResponse {
  available: boolean;
}

interface MemberRating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// 6주차부터 서버가 쓰는 공통 응답 형식
interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

interface SignupResult {
  memberId: number;
  email: string;
  nickname: string;
}

export type { ApiResponse, AvailabilityResponse, MemberRating, SignupResult };
