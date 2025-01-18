// src/components/auth/login-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/auth';

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
});

export function LoginForm() {
  const [error, setError] = useState<string>('');
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // src/components/auth/login-form.tsx の onSubmit 関数を更新
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setError('');
      const response = await login(data);
      localStorage.setItem('token', response.access_token);
      window.location.href = '/dashboard'; // 強制的にページをリロード
    } catch (err) {
      setError('ログインに失敗しました。メールアドレスまたはパスワードを確認してください。');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            メールアドレス
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="メールアドレス"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            パスワード
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="********"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isSubmitting ? 'ログイン中...' : 'ログイン'}
          </button>
        </div>
      </form>
    </div>
  );
}