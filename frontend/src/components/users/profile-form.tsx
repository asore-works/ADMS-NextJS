// src/components/users/profile-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UpdateUserProfile, User } from '@/types/auth';
import { updateUserProfile } from '@/lib/api/users';

const profileSchema = z.object({
  first_name: z.string().min(1, '姓を入力してください'),
  last_name: z.string().min(1, '名を入力してください'),
  phone_number: z.string().optional(),
});

interface ProfileFormProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

// default exportに変更
export default function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
    },
  });

  const onSubmit = async (data: UpdateUserProfile) => {
    try {
      setError('');
      setIsSuccess(false);
      const updatedUser = await updateUserProfile(user.id, data);
      onUpdate(updatedUser);
      setIsSuccess(true);
    } catch (err) {
      setError('プロフィールの更新に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="last_name" className="block text-sm font-semibold text-gray-900 dark:text-white">
          姓
        </label>
        <input
          {...register('last_name')}
          type="text"
          id="last_name"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        {errors.last_name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.last_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="first_name" className="block text-sm font-semibold text-gray-900 dark:text-white">
          名
        </label>
        <input
          {...register('first_name')}
          type="text"
          id="first_name"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        {errors.first_name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.first_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-900 dark:text-white">
          電話番号
        </label>
        <input
          {...register('phone_number')}
          type="tel"
          id="phone_number"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        {errors.phone_number && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone_number.message}</p>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      {isSuccess && (
        <div className="text-sm text-green-600 text-center">
          プロフィールを更新しました
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        {isSubmitting ? '更新中...' : 'プロフィールを更新'}
      </button>
    </form>
  );
}