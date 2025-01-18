// backend/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { profileSchema } from '@/lib/validations/profile';
import { AuthorizationError } from '@/lib/errors';
import { handleError } from '@/lib/errorHandler';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      throw new AuthorizationError();
    }

    const body = await request.json();

    const validatedData = profileSchema.parse({
      postalCode: body.postalCode,
      prefecture: body.prefecture,
      city: body.city,
      streetAddress: body.streetAddress,
      emergencyContact: body.emergencyContact,
      emergencyContactName: body.emergencyContactName,
      birthDate: body.birthDate ? new Date(body.birthDate) : null, // 文字列をDateに変換
      bloodType: body.bloodType || null
    });


    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: validatedData,
      create: {
        ...validatedData,
        userId: session.user.id
      }
    });

    return NextResponse.json({
      postalCode: updatedProfile.postalCode,
      prefecture: updatedProfile.prefecture
    }, { status: 200 });

  } catch (error) {
    return handleError(error);
  }
}