/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [ path.join(__dirname, 'styles') ],
  },
  generateBuildId: async () => process.env.GIT_HASH || 'development',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'xcallscan.xyz',
        port: '',
        pathname: '/_next/**',
      },
    ],
  },
}

module.exports = nextConfig
