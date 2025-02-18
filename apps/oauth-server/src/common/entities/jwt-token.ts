import {integer, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'
import {userTable} from './user.entity'

export const jwtTokenTable = oauthSchema.table('jwt_tokens', {
  id: integer().primaryKey(),
  refreshToken: varchar('refresh_token'),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  ipAddress: varchar('ip_address', {length: 45}),
  userAgent: varchar('user_agent'),
  expiresAt: timestamp('expires_at'),
  revokedAt: timestamp('revoked_at'),
  ...timestampColumns
})

export type SelectOAuthState = typeof jwtTokenTable.$inferSelect
export type InsertOAuthState = typeof jwtTokenTable.$inferInsert
