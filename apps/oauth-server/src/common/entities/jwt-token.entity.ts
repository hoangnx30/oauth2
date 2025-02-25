import {integer, serial, timestamp, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'
import {user} from './user.entity'

export const jwtToken = oauthSchema.table('jwt_tokens', {
  id: serial().primaryKey(),
  refreshToken: varchar('refresh_token'),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  ipAddress: varchar('ip_address', {length: 45}),
  userAgent: varchar('user_agent'),
  expiresAt: timestamp('expires_at'),
  revokedAt: timestamp('revoked_at'),
  ...timestampColumns
})

export type SelectJwtToken = typeof jwtToken.$inferSelect
export type InsertJwtToken = typeof jwtToken.$inferInsert
