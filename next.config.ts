import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "liangsq-1440954703.cos.ap-beijing.myqcloud.com",
      },
    ],
  },
};

export default nextConfig;
