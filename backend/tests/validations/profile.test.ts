// backend/tests/validations/profile.test.ts
import { profileSchema } from '@/lib/validations/profile';

describe('Profile Validation', () => {
  describe('basic validation', () => {
    it('should accept valid minimal data', () => {
      const validData = {
        birthDate: '2000-01-01',
        bloodType: 'A',
        postalCode: '1234567',
        prefecture: '東京都',
        city: '千代田区',
        streetAddress: '1-1',
        emergencyContact: '090-1234-5678',
        emergencyContactName: '緊急連絡先'
      };
      expect(() => profileSchema.parse(validData)).not.toThrow();
    });

    it('should reject when required fields are missing', () => {
      const invalidData = {
        // 必須フィールドの一部を意図的に省略
        prefecture: '東京都',
        city: '千代田区'
      };
      expect(() => profileSchema.parse(invalidData)).toThrow();
    });
  });
});