import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow computer-use / local browsers to load Next.js dev assets
  allowedDevOrigins: ["127.0.0.1", "localhost", "*.localhost"],
};

export default nextConfig;
