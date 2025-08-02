import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This disables ESLint errors from blocking production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;