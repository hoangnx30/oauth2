import {boolean, index, integer, serial, timestamp, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'
import {oauthClient} from './oauth-client.entity'
import {user} from './user.entity'

export const oauthAccessToken = oauthSchema.table(
  'oauth_access_tokens',
  {
    id: serial().primaryKey(),
    accessToken: varchar({length: 255}).unique().notNull(),
    clientId: integer('client_id')
      .notNull()
      .references(() => oauthClient.id, {onDelete: 'cascade'}),
    userId: integer('user_id')
      .notNull()
      .references(() => user.id, {onDelete: 'cascade'}),
    expiresAt: timestamp('expires_at').notNull(),
    scope: varchar(),
    isRevoked: boolean('is_revoked').default(false),

    ...timestampColumns
  },
  (table) => {
    return [
      index('access_token_idx').on(table.accessToken),
      index('oauth_access_token_user_client_id').on(table.clientId, table.userId)
    ]
  }
)

export type SelectOAuthAccessToken = typeof oauthAccessToken.$inferSelect
export type InsertOAuthAccessToken = typeof oauthAccessToken.$inferInsert
