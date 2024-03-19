/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@cloudscape-design/components",
    "@cloudscape-design/component-toolkit",
  ],
  output: "standalone",
  experimental: { serverActions: true },
  async rewrites() {
    return [
      {
        source: "/sam/cognito/login",
        destination:
          "https://efech2cbt0.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/login",
      },
      {
        source: "/sam/cognito/logout",
        destination:
          "https://efech2cbt0.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/logout",
      },
      {
        source: "/sam/cognito/signup",
        destination:
          "https://efech2cbt0.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/signup",
      },
      {
        source: "/sam/cognito/token/refresh",
        destination:
          "https://efech2cbt0.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/token/refresh",
      },
      {
        source: "/sam/cognito/signup/confirm",
        destination:
          "https://efech2cbt0.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/signup/confirm",
      },
      {
        source: "/sam/cognito/group/user/list",
        destination:
          "https://mzildfvx2b.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/group/user/list",
      },
      {
        source: "/sam/cognito/group/user/add",
        destination:
          "https://mzildfvx2b.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/group/user/add",
      },
      {
        source: "/sam/cognito/user/info",
        destination:
          "https://mzildfvx2b.execute-api.ap-northeast-1.amazonaws.com/prod/cognito/user/info",
      },
    ];
  },
};

module.exports = nextConfig;
