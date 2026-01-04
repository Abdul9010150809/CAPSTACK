const { withSentryConfig } = require('@sentry/nextjs');

// Detect Turbopack so we can avoid unsupported options
const isTurbo =
  process.env.__NEXT_TURBOPACK === '1' ||
  process.env.NEXT_TURBO === '1' ||
  process.env.NEXT_PRIVATE_TURBOPACK === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // The `compiler.removeConsole` option is unsupported in Turbopack.
  // Only include it when not running Turbopack.
  ...(isTurbo
    ? {}
    : {
        compiler: {
          removeConsole: process.env.NODE_ENV === 'production',
        },
      }),
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  images: {
    // Removed unoptimized setting to enable image optimization
  },
  headers: async () => {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  transpileClientSDK: true,
}, {
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
});
