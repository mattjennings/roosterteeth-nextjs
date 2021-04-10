import { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'lib/db'
import { getSession } from 'next-auth/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).end()
  }

  const { slug } = JSON.parse(req.body)

  const video = await db
    .get({
      Key: {
        PK: `USER#${session.user.user_id}#KEEP_WATCHING`,
        SK: `VIDEO#${slug}`,
      },
    })
    .then((r) => r.Item)

  res.status(200).json({ progress: video?.progress ?? 0 })
}
