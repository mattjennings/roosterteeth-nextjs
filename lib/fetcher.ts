import { getHostUrl } from './config'

export const fetcher = (
  url: string,
  config: RequestInit & { ctx?: any } = {}
) => {
  const { ctx, ...opts } = config

  return fetch(
    `${ctx && url.startsWith('/') ? getHostUrl(ctx) : ''}${url}`,
    opts
  ).then((res) => res.json())
}
