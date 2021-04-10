const withPWA = require(`next-pwa`)
const runtimeCaching = require(`next-pwa/cache`)

module.exports = withPWA({
  future: { webpack5: true },
  images: {
    domains: [`cdn.roosterteeth.com`],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    CLIENT_ID: process.env.CLIENT_ID,
  },
  pwa: {
    disable: process.env.NODE_ENV === `development`,
    dest: `public`,
    runtimeCaching,
  },
  webpack(config) {
    return {
      ...config,
      externals: [...config.externals, `aws-sdk`],
    }
  },
})
