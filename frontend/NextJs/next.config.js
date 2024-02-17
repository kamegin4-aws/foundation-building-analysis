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
          "https://428hmjva0h.execute-api.ap-northeast-1.amazonaws.com/sam/cognito/login",
      },
      {
        source: "/sam/cognito/logout",
        destination:
          "https://428hmjva0h.execute-api.ap-northeast-1.amazonaws.com/sam/cognito/logout",
      },
      {
        source: "/sam/cognito/signup",
        destination:
          "https://428hmjva0h.execute-api.ap-northeast-1.amazonaws.com/sam/cognito/signup",
      },
      {
        source: "/sam/cognito/signup/confirm",
        destination:
          "https://428hmjva0h.execute-api.ap-northeast-1.amazonaws.com/sam/cognito/signup/confirm",
      },
      {
        source: "/sam/cognito/group/user/list",
        destination:
          "https://j0b4v5x38g.execute-api.ap-northeast-1.amazonaws.com/sam/cognito/group/user/list",
      },
      {
        source: "/sam/cognito/group/user/add",
        destination:
          "https://j0b4v5x38g.execute-api.ap-northeast-1.amazonaws.com/sam/cognito/group/user/add",
      },
      {
        source: "/sam/cognito/user/info",
        destination:
          "https://j0b4v5x38g.execute-api.ap-northeast-1.amazonaws.com/sam/cognito/user/info",
      },
      {
        source: "/sam/cognito/logout",
        destination:
          "https://428hmjva0h.execute-api.ap-northeast-1.amazonaws.com/sam/cognito/logout",
      },
    ];
  },
};

module.exports = nextConfig;
