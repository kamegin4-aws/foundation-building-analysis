'use client';

import React, { useEffect, useState } from 'react';

export default function SessionPage() {
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
              setResult(data);
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

  if (result == undefined) {
    return (
      <div>
        <p>Session 情報取得中...</p>
      </div>
    );
  }

  return (
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
  );
}
