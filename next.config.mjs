/** @type {import('next').NextConfig} */

if (!process.env.API_URL) {
  throw new Error('The API_URL environment variable is not defined!');
}

if (!process.env.STORAGE_HOST) {
  throw new Error('The STORAGE_HOST environment variable is not defined!');
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: process.env.STORAGE_HOST
    },],
  },
  env: {
    API_URL: process.env.API_URL,
    STORAGE_HOST: process.env.STORAGE_HOST
  }
};

export default nextConfig;

