/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@cloudscape-design/components",
    "@cloudscape-design/component-toolkit",
  ],
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: [
        process.env.NEXT_PUBLIC_HOST_DOMAIN,
        process.env.NEXT_PUBLIC_APP_DOMAIN,
      ],
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
        destination: `https://${process.env.NEXT_PUBLIC_UnAUTH_API_ID}.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/login`,
      },
      {
        source: "/cognito/logout",
        destination: `https://${process.env.NEXT_PUBLIC_UnAUTH_API_ID}.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/logout`,
      },
      {
        source: "/cognito/signup",
        destination: `https://${process.env.NEXT_PUBLIC_UnAUTH_API_ID}.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/signup`,
      },
      {
        source: "/cognito/token/refresh",
        destination: `https://${process.env.NEXT_PUBLIC_UnAUTH_API_ID}.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/token/refresh`,
      },
      {
        source: "/cognito/signup/confirm",
        destination: `https://${process.env.NEXT_PUBLIC_UnAUTH_API_ID}.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/signup/confirm`,
      },
      {
        source: "/cognito/group/user/list",
        destination: `https://${process.env.NEXT_PUBLIC_AUTH_API_ID}.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/group/user/list`,
      },
      {
        source: "/cognito/group/user/add",
        destination: `https://${process.env.NEXT_PUBLIC_AUTH_API_ID}.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/group/user/add`,
      },
      {
        source: "/cognito/user/info",
        destination: `https://${process.env.NEXT_PUBLIC_AUTH_API_ID}.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/user/info`,
      },
      {
        source: "/drf/user-contents",
        destination: `${process.env.NEXT_PUBLIC_PROTOCOL}://${process.env.NEXT_PUBLIC_HOST_DOMAIN}/drf/user-contents`,
      },
    ];
  },
};

module.exports = nextConfig;
