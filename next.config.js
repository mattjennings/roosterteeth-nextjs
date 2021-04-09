module.exports = {
  future: { webpack5: true },
  images: {
    domains: [`cdn.roosterteeth.com`],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    CLIENT_ID: process.env.CLIENT_ID,
  },
}
