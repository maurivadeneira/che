/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['corpherejiaeconomica.com', 'localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/kit-heresy',
        destination: '/explicacion-kit2',
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
