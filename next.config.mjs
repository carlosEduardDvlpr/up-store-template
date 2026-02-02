/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    browserDebugInfoInTerminal: true,
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("@opentelemetry/instrumentation");
    }
    return config;
  },

  transpilePackages: ["geist"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com", pathname: "/**" },
      { protocol: "https", hostname: "tailwindui.com", pathname: "/**" },
      { protocol: "https", hostname: "tailwindcss.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "pub-6ad0fa3bd4eb49fb8afd23cdc41ca727.r2.dev",
        pathname: "/**",
      },
      { protocol: "https", hostname: "cdn.vesti.mobi", pathname: "/**" },
      { protocol: "https", hostname: "cdn-op.vesti.mobi", pathname: "/**" },
    ],
  },
};

export default nextConfig;
