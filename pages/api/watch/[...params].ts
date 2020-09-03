import { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'
import { cors } from 'lib/cors'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res)

  const { params } = req.query

  const [id, ...rest] = params as string[]

  const fetchRes = await fetch(
    `${process.env.API_BASE_URL}/api/v1/watch/${id}${
      rest ? '/' + rest.join('/') : ''
    }`
  )

  res.status(fetchRes.status).json(await fetchRes.json())
}
