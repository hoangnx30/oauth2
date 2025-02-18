import {timestamp, uuid, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'
import {oauthClientTable} from './oauth-client.entity'
import {userTable} from './user.entity'

export const oauthAuthorizationRequestTable = oauthSchema.table('oauth_authorization_requests', {
  id: uuid().primaryKey().defaultRandom(),
  clientId: varchar('client_id')
    .unique()
    .notNull()
    .references(() => oauthClientTable.clientId),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  code: varchar().notNull(),
  codeChallenge: varchar('code_challenge'),
  codeChallengeMethod: varchar('code_challenge_method'),
  redirectUri: varchar('redirect_uri').notNull(),
  scope: varchar(),
  state: varchar(),
  expiresAt: timestamp('expires_at').notNull(),
  ...timestampColumns
})

export type SelectOAuthAuthorizationRequest = typeof oauthAuthorizationRequestTable.$inferSelect
export type InserttOAuthAuthorizationRequest = typeof oauthAuthorizationRequestTable.$inferInsert
