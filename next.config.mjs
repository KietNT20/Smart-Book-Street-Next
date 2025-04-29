/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/aibookstreet-viet.firebasestorage.app/o/**',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
