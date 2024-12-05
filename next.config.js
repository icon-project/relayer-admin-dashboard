/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  sassOptions: {
    includePaths: [ path.join(__dirname, 'styles') ],
  },
  experimental: {
    serverComponentsExternalPackages: ['dockerode'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
        pathname: '/avatar/*',
      },
      {
        protocol: 'https',
        hostname: 'xcallscan.xyz',
        pathname: '/_next/image',
      },
    ],
  },
}

module.exports = nextConfig
