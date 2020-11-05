/**
 * node-fetch wrapper that supports relative urls on server
 */
export function fetcher<T = any>(
  url: string,
  opts: RequestInit = {}
): Promise<T> {
  const baseUrl = !process.browser
    ? process.env.NODE_ENV === `development`
      ? `http://${process.env.VERCEL_URL}`
      : `https://${process.env.VERCEL_URL}`
    : ``

  console.log(`${baseUrl}${url}`)
  return fetch(`${baseUrl}${url}`, opts).then((res) => res.json())
}
