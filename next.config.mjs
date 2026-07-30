/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — no server, no runtime cost. Deploy the `out/` folder anywhere.
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
