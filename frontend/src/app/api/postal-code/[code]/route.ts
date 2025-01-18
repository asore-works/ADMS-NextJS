// app/api/postal-code/[code]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const postalCode = params.code.replace('-', '');
    
    if (!/^\d{7}$/.test(postalCode)) {
      return NextResponse.json(
        { error: '郵便番号は7桁の数字で入力してください' },
        { status: 400 }
      );
    }

    const address = await db.query(
      'SELECT postal_code, prefecture, city, street FROM postal_codes WHERE postal_code = $1',
      [postalCode]
    );

    if (address.rows.length === 0) {
      return NextResponse.json(
        { error: '該当する住所が見つかりませんでした' },
        { status: 404 }
      );
    }

    return NextResponse.json(address.rows[0]);
  } catch (error) {
    console.error('Postal code lookup error:', error);
    return NextResponse.json(
      { error: '住所検索中にエラーが発生しました' },
      { status: 500 }
    );
  }
}