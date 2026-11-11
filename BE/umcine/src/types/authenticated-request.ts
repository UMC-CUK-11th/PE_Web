import type { Request } from 'express';

// AuthGuard가 인증 후 memberId를 채워 컨트롤러에 전달합니다.
export interface AuthenticatedRequest extends Request {
  memberId: number;
}
