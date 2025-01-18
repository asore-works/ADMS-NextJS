// backend/lib/validations/profile.ts
import { z } from 'zod';

export const profileSchema = z.object({
  birthDate: z.string()
    .refine(val => !val || !isNaN(new Date(val).getTime()), {
      message: '有効な日付を入力してください'
    }),
  bloodType: z.enum(['A', 'B', 'O', 'AB']),
  postalCode: z.string()
    .regex(/^\d{7}$/, '郵便番号は7桁の数字で入力してください'),
  prefecture: z.string()
    .min(1, '都道府県を選択してください'),
  city: z.string()
    .min(1, '市区町村を入力してください'),
  streetAddress: z.string()
    .min(1, '番地を入力してください'),
  emergencyContact: z.string()
    .regex(/^[0-9-]+$/, '有効な電話番号を入力してください'),
  emergencyContactName: z.string()
    .min(1, '緊急連絡先名を入力してください')
}).strict();