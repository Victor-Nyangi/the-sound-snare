const projectId = process.env.sanityprojectId;
const dataset = process.env.sanitydataset;

// Derive the allowed CDN path from the configured project rather than
// hardcoding an id. A hardcoded id that drifts from sanityprojectId makes
// next/image throw at runtime for every article image.
// Falls back to any project so `next dev` works before .env is filled in.
const sanityImagePath =
  projectId && dataset ? `/images/${projectId}/${dataset}/**` : "/images/**";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: sanityImagePath,
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
