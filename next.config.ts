import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // GitHub Pages serves this repo at /annas-home/ until a custom domain is set up.
  basePath: "/annas-home",
};

export default nextConfig;
