import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  // @ts-ignore
  const session = await getServerSession(authOptions);

  return NextResponse.json(session);
}
