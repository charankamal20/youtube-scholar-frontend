import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.vectorstock.com",
        port: "",
      },
    ],
  },
  experimental: {
    nodeMiddleware: true,
  },
};

export default nextConfig;
