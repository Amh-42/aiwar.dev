/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-rendered on Vercel. The newsletter needs route handlers and server
  // actions, so this is no longer a static `output: 'export'` build.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
};

export default nextConfig;
