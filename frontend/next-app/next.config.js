/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@cloudscape-design/components',
    '@cloudscape-design/component-toolkit'
  ],
  output: 'standalone'
};
  
module.exports = nextConfig;
