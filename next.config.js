/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export since we need dynamic routes
  images: { 
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;