import {integer, serial, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'
import {oauthClient} from './oauth-client.entity'
import {user} from './user.entity'

export const oauthUserConsent = oauthSchema.table('oauth_user_consents', {
  id: serial().primaryKey(),
  clientId: integer('client_id')
    .notNull()
    .references(() => oauthClient.id),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  scope: varchar('scopes').notNull(),
  ...timestampColumns
})

export type SelectOAuthUserConsent = typeof oauthUserConsent.$inferSelect
export type InsertOAuthUserConsent = typeof oauthUserConsent.$inferInsert
