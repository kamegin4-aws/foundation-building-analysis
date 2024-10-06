'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

export const NextAuthProvider = ({ children, session }) => {
  return (
    <SessionProvider
      session={session}
      basePath={`${process.env.NEXT_PUBLIC_BASE_PATH}/api/auth`}
    >
      {children}
    </SessionProvider>
  );
};
