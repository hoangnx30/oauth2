import {relations} from 'drizzle-orm'
import {boolean, index, integer, serial, timestamp, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'
import {oauthClient} from './oauth-client.entity'
import {oauthRequest} from './oauth-request.entity'
import {user} from './user.entity'

export const oauthCode = oauthSchema.table(
  'oauth_authorization_codes',
  {
    id: serial().primaryKey(),
    oauthRequestId: integer('oauth_request_id')
      .notNull()
      .references(() => oauthRequest.id),
    code: varchar('code', {length: 255}).unique().notNull(),
    clientId: integer('client_id')
      .notNull()
      .references(() => oauthClient.id),
    userId: integer('user_id').references(() => user.id),
    expiresAt: timestamp('expires_at').notNull(),
    isUsed: boolean('is_used').default(false),
    ...timestampColumns
  },
  (table) => [index('idx_code').on(table.code), index('idx_user_client').on(table.userId, table.clientId)]
)

export const oauthCodeRelations = relations(oauthCode, ({one}) => ({
  oauthRequest: one(oauthRequest, {
    fields: [oauthCode.oauthRequestId],
    references: [oauthRequest.id]
  })
}))

export type SelectOAuthCode = typeof oauthCode.$inferSelect
export type InsertOAuthAuthorizationCode = typeof oauthCode.$inferInsert
