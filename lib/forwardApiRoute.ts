import { NextApiRequest } from 'next'
import qs from 'qs'

export async function forwardApiRoute(path: string, req: NextApiRequest) {
  const { params, ...query } = req.query

  const fetchRes = await fetch(
    `${process.env.API_BASE_URL}/api/v1${path}?${qs.stringify(query)}`
  )
  return fetchRes
}
