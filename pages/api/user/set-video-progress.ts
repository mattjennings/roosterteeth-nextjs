import { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'lib/db'
import { getSession } from 'next-auth/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { slug, progress } = JSON.parse(req.body) as {
    slug: string
    progress: number
  }

  if (progress > 0 && progress < 1) {
    await db.put({
      Item: {
        PK: `USER#${session.user.user_id}#KEEP_WATCHING`,
        SK: `VIDEO#${slug}`,
        slug,
        progress,
      },
    })
  } else {
    await db.delete({
      Key: {
        PK: `USER#${session.user.user_id}#KEEP_WATCHING`,
        SK: `VIDEO#${slug}`,
      },
    })
  }

  res.status(200).json({})
}
