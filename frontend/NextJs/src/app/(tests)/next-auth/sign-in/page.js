// app/auth/signin/page.jsx

'use client'; // This enables client-side rendering for this component

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function SignInPage() {
  const [userInfo, setUserInfo] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (process.env.NEXT_PUBLIC_NODE_ENV == 'prod') {
      const result = await signIn('credentials', {
        redirect: false,
        username: userInfo.username,
        password: userInfo.password,
      });

      if (result.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        // Redirect to a specific page or reload the page after successful sign-in
        router.push('/');
      }
    }
  };

  useEffect(() => {}, []);

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={userInfo.username}
          onChange={(e) =>
            setUserInfo({ ...userInfo, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={userInfo.password}
          onChange={(e) =>
            setUserInfo({ ...userInfo, password: e.target.value })
          }
        />
        <button type="submit">Sign In</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
