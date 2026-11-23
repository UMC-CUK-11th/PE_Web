import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useLoginMutation } from '../../hooks/use-login-mutation';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const loginMutation = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const isPasswordValid = password.length > 0;
  const canSubmit = isEmailValid && isPasswordValid;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  return (
    <main className='mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col justify-center px-6 py-12'>
      <h1 className='mb-6 text-2xl font-bold text-gray-900'>로그인</h1>

      <form onSubmit={handleSubmit} noValidate className='flex flex-col gap-4'>
        <div>
          <input
            type='email'
            placeholder='이메일'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          />
          {email.length > 0 && !isEmailValid && (
            <p className='mt-1 text-xs text-red-500'>
              올바른 이메일 형식으로 입력해 주세요.
            </p>
          )}
        </div>

        <div>
          <input
            type='password'
            placeholder='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          />
        </div>

        <button
          type='submit'
          disabled={!canSubmit || loginMutation.isPending}
          className='mt-2 rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300'
        >
          {loginMutation.isPending ? '로그인 중' : '로그인'}
        </button>
      </form>

      <p className='mt-6 text-center text-sm text-gray-500'>
        계정이 없으신가요?{' '}
        <Link
          to='/signup'
          className='font-semibold text-blue-600 no-underline hover:underline'
        >
          회원가입
        </Link>
      </p>
    </main>
  );
}
