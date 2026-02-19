import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Erlaubt alle Pfade auf dem Cloudinary-Server
      },
    ],
  },
};

export default nextConfig;
