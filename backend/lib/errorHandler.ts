// backend/lib/errorHandler.ts
import { NextResponse } from 'next/server';
import { AppError } from './errors';

export function handleError(error: unknown) {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code
        }
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: {
          message: 'サーバーエラーが発生しました',
          code: 'INTERNAL_SERVER_ERROR'
        }
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: {
        message: '予期せぬエラーが発生しました',
        code: 'UNKNOWN_ERROR'
      }
    },
    { status: 500 }
  );
}