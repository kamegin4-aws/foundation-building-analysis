'use client';

import logger from '@/library/logging/logger';
import React, { useEffect, useState } from 'react';

export default function SessionPage() {
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

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
    </div>
  );
}
