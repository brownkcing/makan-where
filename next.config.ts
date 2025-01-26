import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Only run linting during the build process on the 'src' directory
    dirs: ["src"],

    // Allow builds to succeed even if there are ESLint errors
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
