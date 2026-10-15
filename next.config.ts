import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The SQLite database lives outside the build; keep output simple.
  output: "standalone",
};

export default nextConfig;