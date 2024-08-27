// app/dashboard/page.jsx

'use client';

import logger from '@/library/logging/logger';
import { signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function SignOutPage() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/session`;
    const options = {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // @ts-ignore
    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => {
              logger.info(`success for session: ${JSON.stringify(data)}`);
              setSession(data);
            })
            .catch((error) => {
              logger.error(`error for session: ${error.message}`);
            });
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch((error) => {
        logger.error(`error for session: ${error.message}`);
      });
  }, []);

  if (session == undefined) {
    return (
      <div>
        <p>Session 情報取得中...</p>
      </div>
    );
  }

  const params = {
    'api-key': process.env.NEXT_PUBLIC_USER_API_KEY,
    'access-token': session.user.accessToken,
  };
  const query = new URLSearchParams(params);

  return (
    <div>
      <h1>SignOutPage</h1>
      <button
        onClick={() => {
          if (process.env.NEXT_PUBLIC_NODE_ENV == 'prod') {
            signOut({
              callbackUrl: `${process.env.NEXT_PUBLIC_BASE_PATH}/api/session/sign-out?${query}`,
              redirect: false,
            });
          }
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
