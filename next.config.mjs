/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/deza97c4p/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/aibookstreet-viet.firebasestorage.app/o/**',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
      },
    ],
  },
};

export default nextConfig;
