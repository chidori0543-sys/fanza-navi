/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/dmm-affiliate-site",
  images: {
    unoptimized: true,
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
