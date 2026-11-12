import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useState, type SubmitEvent } from "react";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { getMyProfile, myProfileQueryKey, type MyProfile } from "../../api/members/get-my-profile";
import { updateMyProfile } from "../../api/members/update-my-profile";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

const titleClassName = "text-[22px] leading-tight font-extrabold tracking-[-1.1px]";
const actionClassName = "inline-flex h-8 items-center rounded-md bg-[#2563eb] px-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60";
const inputClassName = "h-10 w-full rounded-md border border-[#e0e4ea] bg-white px-3 text-xs focus-visible:border-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2563eb] aria-invalid:border-red-600";

function LoginRequired() {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-sm text-[#667080]">
      <p>내 정보를 수정하려면 로그인해 주세요.</p>
      <Link className={actionClassName} to="/login">로그인</Link>
    </div>
  );
}

function EditProfileForm({ accessToken, profile }: { accessToken: string; profile: MyProfile }) {
  const [nickname, setNickname] = useState(profile.nickname);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const nicknameCheck = useMutation({ mutationFn: checkNicknameDuplicate });
  const saveProfile = useMutation({
    mutationFn: (nextNickname: string) => updateMyProfile(accessToken, nextNickname),
    onSuccess: async (updatedProfile) => {
      if (useAuthStore.getState().accessToken !== accessToken) return;

      await queryClient.cancelQueries({ queryKey: myProfileQueryKey, exact: true });
      if (useAuthStore.getState().accessToken === accessToken) {
        queryClient.setQueryData(myProfileQueryKey, updatedProfile);
      }
    },
    onError: (error) => {
      if (isHTTPError(error) && error.response.status === 409) {
        nicknameCheck.reset();
      }
    },
  });

  const normalizedNickname = nickname.trim();
  const isNicknameChanged = normalizedNickname !== profile.nickname;
  const isNicknameValid = normalizedNickname.length >= 2 && normalizedNickname.length <= 12;
  const showNicknameError = isNicknameChanged && !isNicknameValid;
  const isBusy = nicknameCheck.isPending || saveProfile.isPending;
  const canCheck = isNicknameChanged && isNicknameValid && !isBusy;
  const isChecked = nicknameCheck.isSuccess && nicknameCheck.variables === normalizedNickname;
  const isAvailable = isChecked && nicknameCheck.data.available === true;
  const canSave = canCheck && isAvailable;
  const saveErrorStatus = isHTTPError(saveProfile.error) ? saveProfile.error.response.status : undefined;

  let nicknameMessage = "";
  if (showNicknameError) {
    nicknameMessage = "닉네임을 2~12자로 입력해 주세요.";
  } else if (nicknameCheck.isError) {
    nicknameMessage = "중복 확인에 실패했어요. 다시 시도해 주세요.";
  } else if (isChecked) {
    nicknameMessage = isAvailable ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.";
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;

    saveProfile.mutate(normalizedNickname, {
      onSuccess: () => {
        if (useAuthStore.getState().accessToken === accessToken) {
          void navigate({ to: "/my-page" });
        }
      },
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className={titleClassName}>내 정보 수정</h1>
            <p className="mt-1 text-xs text-[#667080]">닉네임을 변경할 수 있어요.</p>
          </div>
          <button type="submit" className={actionClassName} disabled={!canSave}>
            {saveProfile.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <div className="mt-6 grid items-center gap-6 md:grid-cols-2 md:gap-0">
          <div className="flex flex-col items-center gap-2">
            <div className="relative grid h-16 w-16 place-items-center rounded-full bg-[#e2e5e9]">
              <img className="h-9 w-9" src="/icons/person.svg" alt="" />
              <button type="button" className="absolute -right-1 -bottom-1 rounded-full bg-[#f6f7f9] p-0.5" aria-label="프로필 이미지 변경" disabled>
                <img className="h-5 w-5" src="/icons/edit.svg" alt="" />
              </button>
            </div>
            <p className="text-xs font-bold">프로필 이미지</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="edit-nickname" className="mb-1.5 block text-xs font-semibold">닉네임</label>
              <div className="relative">
                <input
                  id="edit-nickname"
                  name="nickname"
                  type="text"
                  autoComplete="nickname"
                  className={cn(inputClassName, "pr-24")}
                  value={nickname}
                  disabled={isBusy}
                  aria-invalid={showNicknameError || (isChecked && !isAvailable)}
                  aria-describedby={nicknameMessage ? "edit-nickname-status" : undefined}
                  onChange={(event) => {
                    setNickname(event.target.value);
                    nicknameCheck.reset();
                    saveProfile.reset();
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 rounded-r-md px-3 text-[11px] font-bold text-[#2563eb] disabled:opacity-50"
                  disabled={!canCheck}
                  onClick={() => nicknameCheck.mutate(normalizedNickname)}
                >
                  {nicknameCheck.isPending ? "확인 중" : "중복 확인"}
                </button>
              </div>
              {nicknameMessage && (
                <p id="edit-nickname-status" role="status" className={cn("mt-1 text-xs", isAvailable ? "text-emerald-700" : "text-red-700")}>
                  {nicknameMessage}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="edit-email" className="mb-1.5 block text-xs font-semibold">이메일</label>
              <input id="edit-email" type="email" className={inputClassName} value={profile.email} readOnly />
            </div>

            {saveProfile.isError && (
              <div role="alert" className="text-xs text-red-700">
                {saveErrorStatus === 401 ? (
                  <>다시 로그인해 주세요. <Link className="font-bold underline" to="/login">로그인</Link></>
                ) : saveErrorStatus === 409 ? (
                  "이미 사용 중인 닉네임이에요. 다른 닉네임을 입력해 주세요."
                ) : (
                  "변경사항을 저장하지 못했어요. 다시 시도해 주세요."
                )}
              </div>
            )}
          </div>
        </div>
      </form>

      <section className="mt-auto flex items-center justify-between gap-3 rounded-md border border-red-400 bg-red-50 px-4 py-3 text-red-700" aria-labelledby="withdrawal-title">
        <div>
          <h2 id="withdrawal-title" className="text-xs font-bold">회원 탈퇴</h2>
          <p className="mt-1 text-[11px]">회원 탈퇴 기능은 준비 중이에요.</p>
        </div>
        <button type="button" className="shrink-0 rounded-md border border-red-400 bg-white px-3 py-2 text-xs font-bold disabled:cursor-not-allowed" disabled>
          회원 탈퇴
        </button>
      </section>
    </>
  );
}

function EditProfileContent({ accessToken }: { accessToken: string }) {
  const profileQuery = useQuery({
    queryKey: myProfileQueryKey,
    queryFn: ({ signal }) => getMyProfile(accessToken, signal),
    retry: false,
  });

  if (profileQuery.isPending) {
    return <p role="status" className="py-12 text-center text-sm text-[#667080]">내 정보를 불러오는 중이에요.</p>;
  }

  if (profileQuery.isError) {
    if (isHTTPError(profileQuery.error) && profileQuery.error.response.status === 401) {
      return <LoginRequired />;
    }

    return (
      <div className="flex flex-col items-center gap-3 py-12 text-sm text-[#667080]">
        <p role="alert">내 정보를 불러오지 못했어요.</p>
        <button type="button" className={actionClassName} onClick={() => void profileQuery.refetch()}>다시 시도</button>
      </div>
    );
  }

  return <EditProfileForm accessToken={accessToken} profile={profileQuery.data} />;
}

export function EditMyProfilePage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <main className="mx-auto flex w-full flex-1 flex-col gap-8 px-6 pt-[18px] pb-5 md:px-12">
      {accessToken ? <EditProfileContent accessToken={accessToken} /> : <LoginRequired />}
    </main>
  );
}
