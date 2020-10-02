import { GetServerSidePropsContext } from 'next'

export const getHostUrl = (ctx: GetServerSidePropsContext) => {
  const host = ctx[`req`].headers.host
  return process.env.NODE_ENV === `production`
    ? `https://${host}`
    : `http://${host}`
}
