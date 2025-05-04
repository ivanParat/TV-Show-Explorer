import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [new URL('https://static.tvmaze.com/uploads/images/**')],
  },
}

export default nextConfig;
