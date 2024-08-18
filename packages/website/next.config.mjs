/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    })
    config.module.rules.push({
      test: /\.tact$/,
      type: "asset/source",
    })
    return config
  },
}

export default nextConfig
