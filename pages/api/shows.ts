import { NextApiRequest, NextApiResponse } from 'next'
import { cors } from 'lib/cors'
import { forwardApiRoute } from 'lib/forwardApiRoute'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res)

  const fetchRes = await forwardApiRoute(`/shows`, req)
  res.status(fetchRes.status).json(await fetchRes.json())
}
