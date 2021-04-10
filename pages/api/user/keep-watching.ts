import { NextApiRequest, NextApiResponse } from 'next'
import { db } from 'lib/db'
import { getSession } from 'next-auth/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).end()
  }

  const items = await db
    .query({
      KeyConditionExpression: `#PK = :PK`,
      ExpressionAttributeNames: {
        '#PK': `PK`,
      },
      ExpressionAttributeValues: {
        ':PK': `USER#${session.user.user_id}#KEEP_WATCHING`,
      },
    })
    .then((r) => r.Items)

  res.status(200).json(items)
}
