import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "res.cloudinary.com",
        pathname: "/ddwerzvdw/**",
      },
      // Google Places photo URLs (used for places.photo_url on share pages).
      // The share pages render these via plain <img>, but listing the hosts is
      // defensive in case a future <Image> uses them.
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
  async headers() {
    // The universal-links association files must serve as application/json with
    // no redirect at the link host (see SHARE_SYSTEM_SPEC.md). They live in
    // public/.well-known/; the AASA file is extensionless, so force the type.
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
      {
        source: "/.well-known/assetlinks.json",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
