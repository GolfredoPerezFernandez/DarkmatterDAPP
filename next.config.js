/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['theuniverse.mypinata.cloud', 'https://theuniverse.mypinata.cloud'],
  },
};

module.exports = nextConfig;
