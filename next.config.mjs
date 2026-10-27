/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  outputFileTracingIncludes: {
    '/blog': ['./src/content/blog/*.mdx'],
  },
  typescript: {
    tsconfigPath: 'tsconfig.build.json',
  },
  images: {
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
    ],
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

export default nextConfig;
