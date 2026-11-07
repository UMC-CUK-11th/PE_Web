export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

export function isValidNickname(nickname: string) {
  return nickname.length >= 2 && nickname.length <= 12;
}

export function validateSignup(values: {
  email: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
}) {
  return {
    email: EMAIL_REGEX.test(values.email),
    nickname: isValidNickname(values.nickname),
    password: PASSWORD_REGEX.test(values.password),
    passwordConfirm:
      values.passwordConfirm.length > 0 &&
      values.password === values.passwordConfirm,
  };
}
