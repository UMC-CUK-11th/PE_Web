import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import AuthPanel from "../../components/auth/auth-panel";
import {
  buttonClassName,
  inputClassName,
  linkClassName,
} from "../../components/auth/form-styles";
import { isValidNickname } from "../../utils/auth/validation";
import { demoProfile } from "./demo-profile";

export function MyEditPage() {
  const [nickname, setNickname] = useState(demoProfile.nickname);
  const [savedNickname, setSavedNickname] = useState(demoProfile.nickname);
  const [message, setMessage] = useState("");
  const valid = isValidNickname(nickname);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid) return;
    setSavedNickname(nickname);
    setMessage("예시 프로필에 반영했어요. 실제 회원 정보는 변경되지 않아요.");
  }

  return (
    <AuthPanel
      title="내 정보 수정"
      description="나를 표현하는 닉네임을 바꿔보세요."
    >
      <p className="mb-6 rounded-2xl bg-zinc-50 p-4 text-sm">
        <span className="block text-xs text-zinc-500">
          예시 프로필 미리보기
        </span>
        <strong className="mt-2 block text-lg">{savedNickname}님</strong>
      </p>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="edit-nickname"
            className="mb-2 block text-sm font-bold"
          >
            닉네임
          </label>
          <input
            id="edit-nickname"
            name="nickname"
            autoComplete="nickname"
            required
            value={nickname}
            aria-invalid={nickname.length > 0 && !valid}
            aria-describedby="edit-nickname-help"
            onChange={(event) => {
              setNickname(event.target.value);
              setMessage("");
            }}
            className={inputClassName}
          />
          <p
            id="edit-nickname-help"
            className={`mt-2 text-xs ${nickname.length > 0 && !valid ? "text-red-600" : "text-zinc-500"}`}
          >
            닉네임은 2자 이상 12자 이하로 입력해주세요.
          </p>
        </div>
        <button disabled={!valid} className={`${buttonClassName} w-full`}>
          수정하기
        </button>
        <p role="status" className="text-sm text-emerald-700">
          {message}
        </p>
      </form>
      <div className="mt-6 text-center text-sm">
        <Link to="/my" className={linkClassName}>
          취소 · 내 정보로 돌아가기
        </Link>
      </div>
    </AuthPanel>
  );
}
