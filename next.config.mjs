/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/deza97c4p/**'
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com'
      }
    ]
  }
};

export default nextConfig;
