import { NextConfig } from 'next'
import { join } from 'path'

const config: NextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    sassOptions: {
        includePaths: [join(__dirname, 'styles')],
    },
    serverExternalPackages: ['dockerode'],
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

export default config
