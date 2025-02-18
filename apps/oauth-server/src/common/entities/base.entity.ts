import {pgSchema, timestamp} from 'drizzle-orm/pg-core'

export const DB_SCHEMA = 'oauth'

export const oauthSchema = pgSchema(DB_SCHEMA)

export const timestampColumns = {
  updateAt: timestamp('updated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at')
}
