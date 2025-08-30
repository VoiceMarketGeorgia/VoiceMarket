/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure proper static file serving
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Configure trailing slash handling
  trailingSlash: false,
  // Ensure proper static exports
  distDir: '.next',
}

export default nextConfig
