// backend/app/api/postal-code/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: '郵便番号が指定されていません' },
        { status: 400 }
      );
    }

    // ハイフンを除去して7桁の数字のみに
    const postalCode = code.replace(/[^0-9]/g, '');
    
    if (postalCode.length !== 7) {
      return NextResponse.json(
        { error: '郵便番号は7桁の数字で指定してください' },
        { status: 400 }
      );
    }

    const address = await prisma.postalCode.findUnique({
      where: {
        postalCode: postalCode,
      },
      select: {
        prefecture: true,
        city: true,
        street: true,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: '該当する住所が見つかりませんでした' },
        { status: 404 }
      );
    }

    return NextResponse.json(address);

  } catch (error) {
    console.error('Postal code lookup error:', error);
    return NextResponse.json(
      { error: '住所検索中にエラーが発生しました' },
      { status: 500 }
    );
  }
}