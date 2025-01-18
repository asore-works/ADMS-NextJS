// src/app/dashboard/profile/page.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import ProfileForm from '@/components/users/profile-form';  // { }を削除
import { User } from '@/types/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Profile Page State:', { user, loading });
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleProfileUpdate = (updatedUser: User) => {
    console.log('Profile updated:', updatedUser);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">プロフィール設定</h1>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <ProfileForm user={user} onUpdate={handleProfileUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}