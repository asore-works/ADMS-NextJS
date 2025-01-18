// src/app/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">ダッシュボード</h2>
      <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg p-6">
        <p className="text-gray-900 dark:text-white">
          ようこそ、{user.first_name} {user.last_name}さん
        </p>
      </div>
    </div>
  );
}