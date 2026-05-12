import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Stripe webhook to receive raw body
  experimental: {
  },
};

export default nextConfig;
