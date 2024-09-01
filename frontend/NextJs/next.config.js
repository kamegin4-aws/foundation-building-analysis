/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      // クライアントサイドからlog4jsモジュールを除外
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
      };
    }

    return config;
  },
  experimental: {
    optimizeFonts: true,
  },
  transpilePackages: [
    '@cloudscape-design/components',
    '@cloudscape-design/component-toolkit',
  ],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: [
        `https://${process.env.HOST_DOMAIN}`,
        `http://${process.env.APP_DOMAIN}:8080`,
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.CLOUDFRONT_DOMAIN,
      },
    ],
  },
};

module.exports = nextConfig;
