import {integer, serial, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'
import {oauthClientTable} from './oauth-client.entity'
import {userTable} from './user.entity'

export const oauthTokenTable = oauthSchema.table('oauth_tokens', {
  id: serial().primaryKey(),
  accessToken: varchar('access_token').notNull().unique(),
  refreshToken: varchar('refresh_token').notNull().unique(),
  clientId: varchar('client_id')
    .notNull()
    .references(() => oauthClientTable.clientId),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  scope: varchar('scope'),
  accessTokenExpiresAt: timestamp('access_token_expires_at').notNull(),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at').notNull(),
  revokedAt: timestamp('revoked_at'),
  previous_token_id: integer('previous_token_id').references(() => oauthTokenTable.id),
  ipAddress: varchar('ip_address', {length: 45}),
  userAgent: varchar('user_agent'),
  expiresAt: timestamp('expires_at'),
  ...timestampColumns
})

export type SelectOAuthToken = typeof oauthTokenTable.$inferSelect
export type InsertOAuthToken = typeof oauthTokenTable.$inferInsert
