/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pics.dmm.co.jp",
      },
      {
        protocol: "https",
        hostname: "p.dmm.co.jp",
      },
    ],
  },
};

export default nextConfig;
