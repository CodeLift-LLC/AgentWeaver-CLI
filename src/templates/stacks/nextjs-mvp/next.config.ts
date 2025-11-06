import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,

  typescript: {
    // Ensure TypeScript errors fail the build
    ignoreBuildErrors: false,
  },

  eslint: {
    // Ensure ESLint errors fail the build
    ignoreDuringBuilds: false,
  },

  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
