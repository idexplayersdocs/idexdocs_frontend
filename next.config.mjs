/** @type {import('next').NextConfig} */

if (!process.env.API_URL) {
  throw new Error('The API_URL environment variable is not defined!');
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'idexdocsblob.blob.core.windows.net'
    },],
  },
  env: {
    API_URL: process.env.API_URL
  }
};

export default nextConfig;

