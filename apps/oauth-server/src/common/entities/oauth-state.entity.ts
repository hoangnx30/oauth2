import {boolean, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'
import {userTable} from './user.entity'

export const oauthStateTable = oauthSchema.table('oauth_states', {
  id: uuid().primaryKey().defaultRandom(),
  state: varchar().unique().notNull(),
  clientId: uuid('client_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').default(false),
  ...timestampColumns
})

export type SelectOAuthState = typeof oauthStateTable.$inferSelect
export type InsertOAuthState = typeof oauthStateTable.$inferInsert
