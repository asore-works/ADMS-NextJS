// backend/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string;
  }

  interface Session {
    user: User;
  }
}