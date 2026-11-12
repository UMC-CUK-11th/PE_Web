const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

export function validEmail(value: string) {
  return value.trim().length <= 254 && EMAIL_REGEX.test(value.trim());
}
export function validNickname(value: string) {
  const length = value.trim().length;
  return length >= 2 && length <= 12;
}
export function validPassword(value: string) {
  // 허용 문자가 ASCII이므로 72자는 BCrypt의 72바이트 제한과 같습니다.
  return value.length <= 72 && PASSWORD_REGEX.test(value);
}
