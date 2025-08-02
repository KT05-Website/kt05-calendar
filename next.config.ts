import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // disables ESLint errors from breaking builds
  },
  typescript: {
    ignoreBuildErrors: true, // disables TypeScript errors from breaking builds
  },
};

export default nextConfig;