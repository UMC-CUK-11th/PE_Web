import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import AuthPanel from "../../components/auth/auth-panel";
import {
  buttonClassName,
  inputClassName,
  linkClassName,
} from "../../components/auth/form-styles";
import RequestStatus from "../../components/movies/request-status";
import { useMemberInfo } from "../../hooks/use-member-info";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { getRequestErrorMessage } from "../../utils/auth/request-error";
import { isValidNickname } from "../../utils/auth/validation";

export function MyEditPage() {
  const member = useMemberInfo();

  return (
    <AuthPanel
      title="내 정보 수정"
      description="나를 표현하는 닉네임을 바꿔보세요."
    >
      {member.data ? (
        <NicknameForm
          key={member.data.email}
          currentNickname={member.data.nickname}
        />
      ) : (
        <RequestStatus
          loading={member.isLoading}
          loadingMessage="회원 정보를 불러오는 중이에요…"
          error={
            member.isError
              ? getRequestErrorMessage(
                  member.error,
                  "회원 정보를 불러오지 못했어요.",
                )
              : undefined
          }
          onRetry={() => void member.refetch()}
        />
      )}
      <div className="mt-6 text-center text-sm">
        <Link to="/my" className={linkClassName}>
          취소 · 내 정보로 돌아가기
        </Link>
      </div>
    </AuthPanel>
  );
}

function NicknameForm({ currentNickname }: { currentNickname: string }) {
  const [draft, setDraft] = useState<string>();
  const nickname = draft ?? currentNickname;
  const valid = isValidNickname(nickname.trim());
  const update = useUpdateMeMutation();
  const canSave =
    valid && nickname.trim() !== currentNickname && !update.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSave) update.mutate(nickname.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
      aria-busy={update.isPending}
    >
      <div>
        <label htmlFor="edit-nickname" className="mb-2 block text-sm font-bold">
          닉네임
        </label>
        <input
          id="edit-nickname"
          name="nickname"
          autoComplete="nickname"
          required
          disabled={update.isPending}
          value={nickname}
          aria-invalid={!valid}
          aria-describedby="edit-nickname-help"
          onChange={(event) => {
            setDraft(event.target.value);
            update.reset();
          }}
          className={inputClassName}
        />
        <p
          id="edit-nickname-help"
          className={`mt-2 text-xs ${valid ? "text-zinc-500" : "text-red-600"}`}
        >
          닉네임은 2자 이상 12자 이하로 입력해주세요.
        </p>
      </div>
      <button disabled={!canSave} className={`${buttonClassName} w-full`}>
        {update.isPending ? "저장 중" : "저장하기"}
      </button>
      {update.isError && (
        <p role="alert" className="text-sm text-red-700">
          {getRequestErrorMessage(update.error, "닉네임을 저장하지 못했어요.")}
        </p>
      )}
    </form>
  );
}
