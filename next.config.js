// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Remove static export since we need dynamic routes
//   images: { 
//     domains: ['images.unsplash.com'],
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  }
};

module.exports = nextConfig;