export interface ProfilePreview {
  email: string;
  nickname: string;
  introduction: string;
}

const STORAGE_KEY = "umcine-week07-profile-preview";
const DEFAULT_PROFILE: ProfilePreview = {
  email: "movie@example.com",
  nickname: "영화팬",
  introduction: "좋아하는 영화를 기록해 보세요.",
};

export function readProfilePreview(): ProfilePreview {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_PROFILE;
    const parsed: unknown = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object") return DEFAULT_PROFILE;
    const value = parsed as Record<string, unknown>;
    return {
      email: typeof value.email === "string" ? value.email : DEFAULT_PROFILE.email,
      nickname: typeof value.nickname === "string" ? value.nickname : DEFAULT_PROFILE.nickname,
      introduction: typeof value.introduction === "string" ? value.introduction : DEFAULT_PROFILE.introduction,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfilePreview(profile: ProfilePreview) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
