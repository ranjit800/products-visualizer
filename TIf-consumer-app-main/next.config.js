/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.**.amazonaws.com'
            }
        ]
    },
    // Ensure environment variables are available at runtime
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_COMPANY_API: process.env.NEXT_PUBLIC_COMPANY_API,
        NEXT_PUBLIC_PRODUCT_API: process.env.NEXT_PUBLIC_PRODUCT_API,
        NEXT_PUBLIC_ANALYTICS_API: process.env.NEXT_PUBLIC_ANALYTICS_API,
    }
}

module.exports = nextConfig