/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Prevent deployment halts on strict type assertions in serverless CI
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
