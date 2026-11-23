import { useState, type FormEvent } from 'react';
import { useUpdateMeMutation } from '../../hooks/use-update-me-mutation';

interface NicknameEditFormProps {
  initialNickname?: string;
}

export function NicknameEditForm({
  initialNickname = '',
}: NicknameEditFormProps) {
  const updateMeMutation = useUpdateMeMutation();
  const [nicknameInput, setNicknameInput] = useState(initialNickname);

  const nickname = nicknameInput.trim();
  const canSubmit = nickname.length >= 2 && nickname.length <= 12;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname });
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
      <div>
        <input
          type='text'
          placeholder='새 닉네임 (2~12자)'
          value={nicknameInput}
          onChange={(e) => setNicknameInput(e.target.value)}
          className='w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
        />
        {nicknameInput.length > 0 && !canSubmit && (
          <p className='mt-1 text-xs text-red-500'>
            닉네임은 2~12자로 입력해 주세요.
          </p>
        )}
      </div>

      <button
        type='submit'
        disabled={!canSubmit || updateMeMutation.isPending}
        className='rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300'
      >
        {updateMeMutation.isPending ? '저장 중' : '저장'}
      </button>
    </form>
  );
}
