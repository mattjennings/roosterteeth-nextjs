const fetch = require(`@vercel/fetch-retry`)()

/**
 * node-fetch wrapper that supports relative urls on server
 */
export async function fetcher<T = any>(
  url: string,
  opts: RequestInit = {}
): Promise<T> {
  const baseUrl =
    url.startsWith(`/`) && !process.browser
      ? process.env.NODE_ENV === `development`
        ? `http://${process.env.VERCEL_URL}`
        : `https://${process.env.VERCEL_URL}`
      : ``

  return fetch(`${baseUrl}${url}`, opts).then(async (res: Response) => {
    const json = await res.json()

    if (res.status >= 400) {
      throw json
    }

    return json
  })
}
