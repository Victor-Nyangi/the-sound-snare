/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      new URL('https://cdn.sanity.io/images/x1bgmc3m/production/**'),
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.sanity.io',
      //   port: '',
      //   pathname: '/images/l0s21o0s/production/**',
      // },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
