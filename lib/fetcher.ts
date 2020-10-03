import { getHostUrl } from './config'

/**
 * node-fetch wrapper
 *
 * Relative URLs are supported for the server when `ctx` is provided
 */
export function fetcher<T = any>(
  url: string,
  config: RequestInit & { ctx?: any } = {}
): Promise<T> {
  const { ctx, ...opts } = config

  return fetch(
    `${ctx && url.startsWith(`/`) ? getHostUrl(ctx) : ``}${url}`,
    opts
  ).then((res) => res.json())
}
