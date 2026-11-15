import ky from "ky";
import { API_BASE_URL } from "../config/env";

// 토큰 없이 보내는 요청용 (회원가입, 중복 확인, 로그인)
export const apiClient = ky.create({ baseUrl: API_BASE_URL, timeout: 15000, retry: 0 });
