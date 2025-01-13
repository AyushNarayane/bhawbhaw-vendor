/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing config...
  transpilePackages: ['@tanstack/react-table'],
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}

module.exports = nextConfig
