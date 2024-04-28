/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@cloudscape-design/components",
    "@cloudscape-design/component-toolkit",
  ],
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_HOST_DOMAIN, "*.kamegin.com"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN,
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/cognito/login",
        destination: process.env.NEXT_PUBLIC_COGNITO_LOGIN,
      },
      {
        source: "/cognito/logout",
        destination: process.env.NEXT_PUBLIC_COGNITO_LOGOUT,
      },
      {
        source: "/cognito/signup",
        destination: process.env.NEXT_PUBLIC_COGNITO_SIGNUP,
      },
      {
        source: "/cognito/token/refresh",
        destination: process.env.NEXT_PUBLIC_COGNITO_TOKEN_REFRESH,
      },
      {
        source: "/cognito/signup/confirm",
        destination: process.env.NEXT_PUBLIC_COGNITO_SIGNUP_CONFIRM,
      },
      {
        source: "/cognito/group/user/list",
        destination: process.env.NEXT_PUBLIC_COGNITO_GROUP_USER_LIST,
      },
      {
        source: "/cognito/group/user/add",
        destination: process.env.NEXT_PUBLIC_COGNITO_GROUP_USER_ADD,
      },
      {
        source: "/cognito/user/info",
        destination: process.env.NEXT_PUBLIC_COGNITO_USER_INFO,
      },
      {
        source: "/drf/user-contents",
        destination: `${process.env.NEXT_PUBLIC_PROTOCOL}://${process.env.NEXT_PUBLIC_HOST_DOMAIN}/drf/user-contents`,
      },
    ];
  },
};

module.exports = nextConfig;
