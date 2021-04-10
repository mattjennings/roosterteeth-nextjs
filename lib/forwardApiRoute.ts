import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/client'
import qs from 'qs'

export async function forwardApiRoute(path: string, req: NextApiRequest) {
  const { params, ...query } = req.query
  const session = await getSession({ req })

  const fetchRes = await fetch(
    `${process.env.API_BASE_URL}${path}?${qs.stringify(query)}`,
    {
      headers: session
        ? {
            Authorization: `Bearer ${session.user.access_token}`,
          }
        : {},
    }
  )
  return fetchRes
}
