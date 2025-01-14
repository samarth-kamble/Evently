import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            { hostname: "adamant-antelope-943.convex.cloud", protocol: "https" },
            { hostname: "wary-anaconda-29.convex.cloud", protocol: "https" },
        ],
    },
};

export default nextConfig;
