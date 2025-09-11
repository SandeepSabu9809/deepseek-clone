// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: "public",       // service worker files will be generated here
    register: true,       // automatically registers the service worker
    skipWaiting: true,    // activates new service worker immediately
  },
});

export default nextConfig;
