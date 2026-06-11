import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    instantNavigationDevToolsToggle: false,
  },
};

export default nextConfig;
