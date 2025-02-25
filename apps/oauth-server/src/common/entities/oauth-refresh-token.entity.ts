import {boolean, index, integer, serial, timestamp, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'
import {oauthAccessToken} from './oauth-access-token.entity'
import {oauthClient} from './oauth-client.entity'
import {user} from './user.entity'

export const oauthRefreshToken = oauthSchema.table(
  'oauth_refresh_tokens',
  {
    id: serial().primaryKey(),
    refreshToken: varchar('refresh_token', {length: 255}).unique().notNull(),
    accessTokenId: serial('access_token_id')
      .notNull()
      .references(() => oauthAccessToken.id),
    clientId: integer('client_id')
      .notNull()
      .references(() => oauthClient.id),
    userId: integer('user_id')
      .notNull()
      .references(() => user.id),
    expiresAt: timestamp('expires_at').notNull(),
    isRevoked: boolean('is_revoked').default(false),
    ...timestampColumns
  },
  (table) => {
    return [
      index('refresh_token_idx').on(table.refreshToken),
      index('oauth_refresh_token_user_client_id').on(table.clientId, table.userId)
    ]
  }
)

export type SelectOAuthRefreshToken = typeof oauthRefreshToken.$inferSelect
export type InsertOAuthRefreshToken = typeof oauthRefreshToken.$inferInsert
