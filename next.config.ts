import type { NextConfig } from "next";
import { basePath } from "./lib/base-path";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // GitHub Pages serves this repo at /annas-home/ until a custom domain is set up.
  basePath,
};

export default nextConfig;
