import { NextAuthProvider } from '@/ui/components/provider/session';
import { getServerSession } from 'next-auth';
import React from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function TestLayout({ children }) {
  // @ts-ignore
  const session = await getServerSession(authOptions);

  return <NextAuthProvider session={session}>{children}</NextAuthProvider>;
}
