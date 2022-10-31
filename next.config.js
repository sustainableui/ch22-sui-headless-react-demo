/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /sui-headless-react.*\.(ts|js)x?$/,
      use: options.defaultLoaders.babel,
    });

    return config;
  },
};

module.exports = nextConfig;
