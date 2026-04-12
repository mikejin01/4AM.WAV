import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "dice-media.imgix.net",
      },
      {
        protocol: "https",
        hostname: "posh.vip",
      },
      {
        protocol: "https",
        hostname: "posh-images-originals-production.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
