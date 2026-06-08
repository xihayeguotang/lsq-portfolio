import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/cos/:path*",
        destination:
          "https://liangsq-1440954703.cos.ap-beijing.myqcloud.com/:path*",
      },
    ];
  },
};

export default nextConfig;
