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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://liangsq-1440954703.cos.ap-beijing.myqcloud.com https://miaoduo.fbcontent.cn https://quickchart.io",
              "connect-src 'self' https: wss: ws:",
              "font-src 'self' data:",
              "media-src 'self' https://liangsq-1440954703.cos.ap-beijing.myqcloud.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
