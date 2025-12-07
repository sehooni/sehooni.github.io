import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for GitHub Pages compatibility if needed
  trailingSlash: true,
};

export default nextConfig;
