import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@monaco-editor/react'],
  },
};

export default nextConfig;
