// app/dashboard/page.jsx

'use client';

import { signOut } from 'next-auth/react';

import React, { useEffect, useState } from 'react';

export default function SignOutPage() {
  const [session, setSession] = useState(undefined);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
              setSession(data);
            })
            .catch((error) => {
              setError(error.message);
            });
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch((error) => {
        setError(error.message);
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
      <h1>SignOutPage</h1>
      <button
        onClick={async () => {
          const url = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/session/sign-out`;
          const options = {
            method: 'POST',
            cache: 'no-cache',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accessToken: session.user.accessToken,
            }),
          };

          // @ts-ignore
          const response = await fetch(url, options);

          if (response.ok) {
            signOut({
              redirect: false,
            });
          }

          setResult({ message: 'サインアウトしました' });
        }}
      >
        Sign Out
      </button>

      <section>
        {result && (
          <div>
            <h2>Result:</h2>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
        {error && (
          <div>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </section>
    </div>
  );
}
