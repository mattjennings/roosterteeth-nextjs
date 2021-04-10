import AWS from 'aws-sdk'
import { TableClient } from 'dynamodb-table-client'

AWS.config.update({
  region: `us-east-1`,
  accessKeyId: process.env.DYNAMODB_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMODB_SECRET_KEY,
})

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
})
