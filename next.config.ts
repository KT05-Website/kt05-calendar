import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This prevents linting errors from failing your production build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;