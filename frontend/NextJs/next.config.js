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
        source: "/sam/cognito/login",
        destination:
          "https://nsx2iwuzd7.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/login",
      },
      {
        source: "/sam/cognito/logout",
        destination:
          "https://nsx2iwuzd7.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/logout",
      },
      {
        source: "/sam/cognito/signup",
        destination:
          "https://nsx2iwuzd7.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/signup",
      },
      {
        source: "/sam/cognito/token/refresh",
        destination:
          "https://nsx2iwuzd7.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/token/refresh",
      },
      {
        source: "/sam/cognito/signup/confirm",
        destination:
          "https://nsx2iwuzd7.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/signup/confirm",
      },
      {
        source: "/sam/cognito/group/user/list",
        destination:
          "https://jahojnl1jj.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/group/user/list",
      },
      {
        source: "/sam/cognito/group/user/add",
        destination:
          "https://jahojnl1jj.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/group/user/add",
      },
      {
        source: "/sam/cognito/user/info",
        destination:
          "https://jahojnl1jj.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/user/info",
      },
      {
        source: "/drf/user-contents",
        destination: `${process.env.NEXT_PUBLIC_PROTOCOL}://${process.env.NEXT_PUBLIC_HOST_DOMAIN}/drf/user-contents`,
      },
    ];
  },
};

module.exports = nextConfig;
