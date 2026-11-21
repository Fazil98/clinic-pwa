import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Keep the clinic demo simple — dynamic client screens (search, forms, nav)
  // don't need Cache Components yet.
  experimental: {
    // Avoid stale stylesheet output after a dev-server file watcher error.
    turbopackFileSystemCacheForDev: false,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
