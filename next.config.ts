import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // turbopack: {},
  // PWA will be configured via custom service worker in production
  // next-pwa is deprecated with Turbopack; we use manual SW registration
};

export default withNextIntl(nextConfig);
