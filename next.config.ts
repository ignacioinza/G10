import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep dependency tracing inside this app. Some local/CI environments have
  // unrelated lockfiles higher in the filesystem, which can make Next infer
  // the wrong workspace root and fail while traversing inaccessible folders.
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
