// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { uploadImage } from '@/lib/storage';

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const formData = await request.formData();
    let profileImageUrl = formData.get('profile_image_url') as string;

    // プロフィール画像のアップロード処理
    const profileImage = formData.get('profile_image') as File;
    if (profileImage) {
      profileImageUrl = await uploadImage(profileImage);
    }

    // プロフィールデータの更新
    await db.query(
      `UPDATE user_profiles 
       SET birth_date = $1,
           blood_type = $2,
           postal_code = $3,
           prefecture = $4,
           city = $5,
           street_address = $6,
           building_name = $7,
           profile_image_url = $8,
           emergency_contact = $9,
           emergency_contact_name = $10,
           profile_message = $11,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $12`,
      [
        formData.get('birth_date'),
        formData.get('blood_type'),
        formData.get('postal_code'),
        formData.get('prefecture'),
        formData.get('city'),
        formData.get('street_address'),
        formData.get('building_name'),
        profileImageUrl,
        formData.get('emergency_contact'),
        formData.get('emergency_contact_name'),
        formData.get('profile_message'),
        session.user.id
      ]
    );

    return NextResponse.json({ message: 'プロフィールを更新しました' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'プロフィールの更新中にエラーが発生しました' },
      { status: 500 }
    );
  }
}