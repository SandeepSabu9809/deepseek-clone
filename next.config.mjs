import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  // ⚠ must be top-level
  experimental: {
    appDir: true,
  },
  pwa: {
    dest: "public",       // service worker folder
    disable: process.env.NODE_ENV === "development",
    // do NOT include `register` or `skipWaiting`
  },
};

export default withPWA(nextConfig);
