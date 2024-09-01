// app/auth/sign-in/page.jsx
'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // signIn関数を使ってクライアントサイドから認証リクエストを送信
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      // エラーハンドリング
      console.error('Failed to sign in:', result.error);
    } else {
      // 認証成功後のリダイレクトまたは他の処理
      console.log(`Successfully signed in: ${JSON.stringify(result)}`);
    }
  };

  return (
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
  );
}
