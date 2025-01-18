// src/app/auth/login/page.tsx
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ADMSにログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ドローン業務管理システム
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}