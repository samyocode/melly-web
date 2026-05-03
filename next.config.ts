import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "res.cloudinary.com",
        pathname: "/ddwerzvdw/**",
      },
      // Google Places photo URLs (used for places_catalog.photo_url).
      // We pass `unoptimized` on these <Image>s since the URL is
      // short-lived, but listing the hosts is defensive.
      {
        protocol: "https" as const,
        hostname: "places.googleapis.com",
      },
      {
        protocol: "https" as const,
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https" as const,
        hostname: "maps.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
