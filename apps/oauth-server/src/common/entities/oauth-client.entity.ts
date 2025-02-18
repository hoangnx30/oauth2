import {boolean, uuid, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'

export const oauthClientTable = oauthSchema.table('oauth_clients', {
  id: uuid().primaryKey().defaultRandom(),
  clientId: varchar('client_id', {length: 255}).unique().notNull(),
  clientSecret: varchar('client_secret'),
  clientName: varchar('client_name').notNull(),
  clientUri: varchar('client_uri'),
  redirectUri: varchar('redirect_uri').notNull(),
  scope: varchar(),
  isConfidential: boolean('is_confidential').notNull().default(false),
  isActive: boolean('is_active').default(true),
  createdBy: uuid('create_by').notNull(),
  ...timestampColumns
})

export type SelectOAuthClient = typeof oauthClientTable.$inferSelect
export type InsertOAuthClient = typeof oauthClientTable.$inferInsert
