'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  ADMS Dashboard
                </h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  ホーム
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  プロフィール
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-900 dark:text-white">{user?.email}</span>
              <ThemeSwitcher />
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}