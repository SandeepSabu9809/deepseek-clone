import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  pwa: {
    dest: "public", // service worker output folder
    disable: process.env.NODE_ENV === "development", // disable PWA in dev
  },
};

export default withPWA(nextConfig);
