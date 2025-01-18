// backend/tests/api/profile.test.ts
import { createMocks } from 'node-mocks-http';
import { PUT } from '@/app/api/profile/route';
import { prismaMock } from '../setup';
import { mockSession } from '../mocks/auth';

jest.mock('next-auth/next', () => ({
  getServerSession: () => mockSession
}));

// backend/tests/api/profile.test.ts
describe('Profile API', () => {
  describe('PUT /api/profile', () => {
    it('should update profile successfully', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        body: {
          postalCode: '1234567',
          prefecture: '東京都',
          city: '千代田区',
          streetAddress: '1-1',
          emergencyContact: '090-1234-5678',
          emergencyContactName: '緊急連絡先',
          birthDate: new Date('1990-01-01'), // 文字列から Date オブジェクトに変更
          bloodType: 'A'
        }
      });

      (req.json as jest.Mock) = jest.fn().mockResolvedValue({
        postalCode: '1234567',
        prefecture: '東京都',
        city: '千代田区',
        streetAddress: '1-1',
        emergencyContact: '090-1234-5678',
        emergencyContactName: '緊急連絡先',
        birthDate: new Date('1990-01-01'), // こちらも Date オブジェクトに変更
        bloodType: 'A'
      });

      prismaMock.userProfile.upsert.mockResolvedValueOnce({
        id: 1,
        userId: 'test-user-id',
        postalCode: '1234567',
        prefecture: '東京都',
        city: '千代田区',
        streetAddress: '1-1',
        emergencyContact: '090-1234-5678',
        emergencyContactName: '緊急連絡先',
        birthDate: new Date('1990-01-01'), // Date オブジェクトに変更
        bloodType: 'A',
        buildingName: null,
        profileImageUrl: null,
        profileMessage: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // 以下は前回と同じ
    });
  });
});