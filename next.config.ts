import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash — used by the mock movie database
      { protocol: "https", hostname: "images.unsplash.com" },
      // TMDB CDN — used when a user supplies their own API key
      { protocol: "https", hostname: "image.tmdb.org" },
      // DiceBear — avatar generation for user profiles
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
};

export default nextConfig;
