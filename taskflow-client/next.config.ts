import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // If eslint/typescript blocks cause issues with this specific Next version, 
  // we'll stick to the core required options for now.
};

export default nextConfig;
