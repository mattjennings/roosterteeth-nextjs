import { fetcher } from './fetcher'

export async function getVideoInfo(id: string) {
  const [watchRes, metaRes] = await Promise.all([
    fetcher(`${process.env.API_BASE_URL}/api/v1/watch/${id}/videos`),
    fetcher(`${process.env.API_BASE_URL}/api/v1/watch/${id}`),
  ])

  const attributes = watchRes.data?.[0]?.attributes
  const url = attributes?.url ?? null

  return {
    attributes: metaRes.data?.[0]?.attributes,
    url,
    error: watchRes.access === false && watchRes.message,
  }
}
