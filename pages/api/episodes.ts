import { fetcher } from 'lib/fetcher'
import { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'
import { cors } from 'lib/cors'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res)

  const query = req.query

  const fetchRes = await fetch(
    `${process.env.API_BASE_URL}/api/v1/episodes?${qs.stringify(query)}`
  )

  res.status(fetchRes.status).json(await fetchRes.json())
}
