import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  reloadOnOnline: true,
});

const nextConfig: NextConfig = {
  // PWA plugin injects webpack config; empty turbopack opts into Turbopack for dev.
  turbopack: {},
};

export default withPWA(nextConfig);
