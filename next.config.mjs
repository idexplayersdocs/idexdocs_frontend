/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['idexdocsblob.blob.core.windows.net'],
  },
  env: {
    API_URL: process.env.API_URL
  }
};

export default nextConfig;

