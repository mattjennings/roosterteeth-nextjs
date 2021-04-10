import { TableClient } from 'dynamodb-table-client'

export type DynamoItem<T> = T & {
  PK: string
  SK: string
  GSI1PK: string
  GSI1SK: string
  GSI2PK: string
  GSI2SK: string
}

export const db = new TableClient({
  tableName: `rt-nextjs-${process.env.STAGE}`,
  region: `us-east-1`,
})
