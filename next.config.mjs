/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'idexdocsblob.blob.core.windows.net',
        port: '',
        pathname: '/atleta-perfil/**',
      },
    ],
  },
};

export default nextConfig;

