import { NextApiRequest, NextApiResponse } from 'next'
import { cors } from 'lib/cors'
import { forwardApiRoute } from 'lib/forwardApiRoute'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res)

  const { params } = req.query

  const [id, ...rest] = params as string[]

  const fetchRes = await forwardApiRoute(
    `/channels/${id}${rest ? `/` + rest.join(`/`) : ``}`,
    req
  )

  res.status(fetchRes.status).json(await fetchRes.json())
}
