// app/api/auth/[...nextauth]/route.js
import { randomBytes, randomUUID } from 'crypto';
import Redis from 'ioredis';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Redisクライアントの作成
const redisClient = new Redis(
  `redis://${process.env.NEXT_PUBLIC_REDIS_ENDPOINT}:${process.env.NEXT_PUBLIC_REDIS_PORT}`
);

// カスタムRedis Adapterの実装
const RedisAdapter = (client) => {
  return {
    async createUser(user) {
      await client.set(`user:${user.id}`, JSON.stringify(user));
      return user;
    },
    async getUser(id) {
      const user = await client.get(`user:${id}`);
      return user ? JSON.parse(user) : null;
    },
    async getUserByEmail(email) {
      const keys = await client.keys('user:*');
      for (const key of keys) {
        const user = JSON.parse(await client.get(key));
        if (user.email === email) return user;
      }
      return null;
    },
    async updateUser(user) {
      await client.set(`user:${user.id}`, JSON.stringify(user));
      return user;
    },
    async deleteUser(userId) {
      await client.del(`user:${userId}`);
    },
    async linkAccount(account) {
      await client.set(
        `account:${account.provider}:${account.providerAccountId}`,
        JSON.stringify(account)
      );
      return account;
    },
    async unlinkAccount({ provider, providerAccountId }) {
      await client.del(`account:${provider}:${providerAccountId}`);
    },
    async createSession({ sessionToken, userId, expires }) {
      const session = { sessionToken, userId, expires };
      await client.set(
        `session:${sessionToken}`,
        JSON.stringify(session),
        'EX',
        expires
      );
      return session;
    },
    async getSessionAndUser(sessionToken) {
      const session = JSON.parse(await client.get(`session:${sessionToken}`));
      if (!session) return null;
      const user = JSON.parse(await client.get(`user:${session.userId}`));
      return { session, user };
    },
    async updateSession(session) {
      await client.set(
        `session:${session.sessionToken}`,
        JSON.stringify(session)
      );
      return session;
    },
    async deleteSession(sessionToken) {
      await client.del(`session:${sessionToken}`);
    },
  };
};

export const authOptions = {
  NEXTAUTH_URL:
    process.env.NEXT_PUBLIC_NODE_ENV === 'prod'
      ? `https://${process.env.NEXT_PUBLIC_HOST_DOMAIN}/${process.env.NEXT_PUBLIC_BASE_PATH}/api/auth`
      : undefined,
  adapter: RedisAdapter(redisClient),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;
        const url = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/user/sign-in`;
        const options = {
          method: 'POST',
          cache: 'no-cache',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': process.env.NEXT_PUBLIC_USER_API_KEY,
          },
          body: JSON.stringify({
            user_name: username,
            password: password,
          }),
        };

        // @ts-ignore
        const res = await fetch(url, options);
        const user = await res.json();

        if (res.ok && user) {
          return user; // 認証成功
        } else {
          return null; // 認証失敗
        }
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  session: {
    strategy: 'database', // セッションデータをRedisに保存するために"database"ストラテジーを使用
    maxAge: 30 * 24 * 60 * 60, // 30日間のセッション有効期限
    updateAge: 24 * 60 * 60, // 24時間ごとにデータベースを更新
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString('hex'); // カスタムセッショントークンの生成
    },
  },
  callbacks: {
    async session({ session, user }) {
      session.user['id'] = user['user_id'];
      session.user['name'] = user['user_name'];
      session.user['email'] = user['email'];
      session.user['plan'] = user['plan'];
      session.user['accessToken'] = user['access_token'];
      session.user['refreshToken'] = user['refresh_token'];
      session.user['idToken'] = user['id_token'];
      session.expires = user['expires'];
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NEXT_PUBLIC_NODE_ENV === 'prod',
      },
    },
  },
  useSecureCookies: process.env.NEXT_PUBLIC_NODE_ENV === 'prod',
};

// NextAuthの設定
// @ts-ignore
const handler = NextAuth(authOptions);

// GETおよびPOSTメソッドのエクスポート
export { handler as GET, handler as POST };
