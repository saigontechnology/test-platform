/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // Warning: This allows production builds to successfully complete even if
  // your project has ESLint errors.
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false
};

module.exports = nextConfig;
