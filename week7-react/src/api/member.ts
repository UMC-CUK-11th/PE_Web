import ky from "ky";

interface CheckResponse {
  available: boolean;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function checkEmail(email: string): Promise<boolean> {
  const response = await ky
    .get(`${API_BASE_URL}/members/email/${encodeURIComponent(email)}`)
    .json<CheckResponse>();

  return response.available;
}

export async function checkNickname(nickname: string): Promise<boolean> {
  const response = await ky
    .get(`${API_BASE_URL}/members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckResponse>();

  return response.available;
}

interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

export async function signup(data: SignupRequest): Promise<void> {
  await ky.post(`${API_BASE_URL}/members`, {
    json: data,
  });
}
