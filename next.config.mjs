/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Typechecking will be run separately via `npm run typecheck`
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
