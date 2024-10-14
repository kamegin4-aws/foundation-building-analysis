// app/auth/sign-in/page.jsx
'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';

export default function SignIn() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // signIn関数を使ってクライアントサイドから認証リクエストを送信
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      if (result?.error) {
        // エラーハンドリング
        setError(result.error);
      } else {
        // 認証成功後のリダイレクトまたは他の処理
        setResult(result);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('エラー');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Sign in</button>
      </form>

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
