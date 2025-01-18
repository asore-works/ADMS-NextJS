// backend/tests/mocks/auth.ts
export const mockSession = {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User'
    },
    expires: new Date().toISOString()
  };