import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the clinic demo simple — dynamic client screens (search, forms, nav)
  // don't need Cache Components yet.
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
