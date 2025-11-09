// 🆕 Added: Bundle Analyzer + Edge + Server Actions
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true, // ✅ enables use server
  },
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=5, stale-while-revalidate=30' },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
