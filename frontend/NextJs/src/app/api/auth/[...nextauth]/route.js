// app/api/auth/[...nextauth]/route.js
import { randomBytes, randomUUID } from 'crypto';
import Redis from 'ioredis';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Redis client creation
const redisClient = new Redis(
  process.env.NODE_ENV === 'production'
    ? `redis://${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`
    : `redis://${process.env.HOST_DOMAIN_LOCAL}:${process.env.REDIS_PORT}`
);

// Custom session save logic
const saveSessionToRedis = async (sessionToken, session) => {
  await redisClient.set(
    `session:${sessionToken}`,
    JSON.stringify(session),
    'EX',
    60 * 60 // Session expiration (e.g., 1 hour)
  );
};

// Custom session retrieval logic
const getSessionFromRedis = async (sessionToken) => {
  const sessionStr = await redisClient.get(`session:${sessionToken}`);

  return sessionStr ? JSON.parse(sessionStr) : null;
};

// Custom session update logic
const updateSessionInRedis = async (sessionToken, newSessionData) => {
  const existingSessionStr = await redisClient.get(`session:${sessionToken}`);

  if (!existingSessionStr) {
    throw new Error('Session not found');
  }

  const existingSession = JSON.parse(existingSessionStr);
  const updatedSession = {
    ...existingSession,
    ...newSessionData,
  };

  await redisClient.set(
    `session:${sessionToken}`,
    JSON.stringify(updatedSession),
    'EX',
    60 * 60 // Session expiration (e.g., 1 hour)
  );

  return updatedSession;
};

export const authOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials;
        const url =
          'https://b7bjj7fb3i.execute-api.ap-northeast-1.amazonaws.com/paid/cognito/sign-in';
        const options = {
          method: 'POST',
          cache: 'no-cache',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': process.env.API_KEY,
          },
          body: JSON.stringify({
            user_name: username,
            password: password,
          }),
        };

        // @ts-ignore
        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(`Failed to sign in: ${await res.text()}`);
        }
        const user = await res.json();

        console.log(`user: ${JSON.stringify(user)}`);
        if (res.ok && user) {
          return user; // Authentication success
        } else {
          return null; // Authentication failed
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // Session expiration (e.g., 1 hour)
  },
  callbacks: {
    async signIn({ user }) {
      const sessionToken = randomUUID?.() ?? randomBytes(32).toString('hex');
      const session = {
        name: user['user_name'],
        accessToken: user['access_token'],
        refreshToken: user['refresh_token'],
        idToken: user['id_token'],
        expires: new Date(user['expires']),
      };
      await saveSessionToRedis(sessionToken, session);
      user.sessionToken = sessionToken;
      return true;
    },
    async session({ session, token }) {
      const redisSession = await getSessionFromRedis(token.sessionToken);

      if (redisSession) {
        console.log(`Retrieved redisSession: ${JSON.stringify(redisSession)}`);
        session.user = {
          ...token, // Keep default JWT fields
          name: redisSession.name,
          accessToken: redisSession.accessToken,
          refreshToken: redisSession.refreshToken,
          idToken: redisSession.idToken,
          expires: redisSession.expires,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sessionToken = user.sessionToken;
      }

      // Example of refreshing token logic
      const redisSession = await getSessionFromRedis(token.sessionToken);
      const date = new Date(); // 現在の日時を取得
      const jstDateString = date.toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
      });
      const jstDate = new Date(jstDateString);
      if (redisSession && new Date(redisSession.expires) < jstDate) {
        // Assume fetchNewAccessToken is a function that refreshes the access token
        const url =
          'https://b7bjj7fb3i.execute-api.ap-northeast-1.amazonaws.com/paid/cognito/token/refresh';
        const options = {
          method: 'POST',
          cache: 'no-cache',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': process.env.API_KEY,
          },
          body: JSON.stringify({
            refresh_token: redisSession.refreshToken,
            user_name: redisSession.name,
          }),
        };

        // @ts-ignore
        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(
            `Failed to refresh access token: ${await res.text()}`
          );
        }
        const newAccessTokenData = await res.json();
        if (newAccessTokenData) {
          const updatedSession = await updateSessionInRedis(
            token.sessionToken,
            {
              accessToken: newAccessTokenData.access_token,
              refreshToken: newAccessTokenData.refresh_token,
              idToken: newAccessTokenData.id_token,
              expires: newAccessTokenData.expires,
            }
          );
          token = {
            ...token,
            accessToken: updatedSession.accessToken,
            refreshToken: updatedSession.refreshToken,
            idToken: updatedSession.idToken,
            expires: updatedSession.expires,
          };
        }
      }

      return token;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  pages: {
    signIn: `${process.env.NEXT_PUBLIC_BASE_PATH}/next-auth/sign-in`,
  },
};

// NextAuth configuration
// @ts-ignore
const handler = NextAuth(authOptions);

// Export GET and POST methods
export { handler as GET, handler as POST };
