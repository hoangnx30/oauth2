import {relations} from 'drizzle-orm'
import {integer, pgEnum, serial, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'
import {oauthClient} from './oauth-client.entity'
import {user} from './user.entity'

export const statusEnum = pgEnum('status', ['initiated', 'authenticated', 'approved', 'denied', 'expired'])

export const oauthRequest = oauthSchema.table('oauth_authorization_requests', {
  id: serial().primaryKey(),
  clientId: integer('client_id').notNull(),
  userId: integer('user_id'),
  // responseType: varchar('response_type'. {length: 50}).notNull(), //  -- 'code', 'token' // TODO: Research later
  redirectUri: varchar('redirect_uri').notNull(),
  state: varchar('state', {length: 1000}).notNull(), // -- CSRF protection
  scope: varchar('scopes', {length: 1000}).notNull(), // -- JSON array of requested scopes
  codeChallenge: varchar('code_challenge', {length: 255}), // -- For PKCE
  codeChallengeMethod: varchar('code_challenge_method', {length: 20}), // -- 'S256' or 'plain'
  // nonce: varchar('nonce', {length: 255}), // -- For OpenID Connect // TODO: Research later
  // prompt: varchar('prompt', {length: 50}), // -- 'none', 'login', 'consent', 'select_account' // TODO: Research later
  status: statusEnum().notNull().default('initiated'), // -- 'initiated', 'pending', 'approved', 'denied', 'expired'
  expiresAt: timestamp('expires_at').notNull(),
  ...timestampColumns
})

export const oauthAuthorizationRequestRelations = relations(oauthRequest, ({one}) => ({
  user: one(user, {
    fields: [oauthRequest.userId],
    references: [user.id]
  }),
  oauthClient: one(oauthClient, {
    fields: [oauthRequest.clientId],
    references: [oauthClient.id]
  })
}))

export type SelectOAuthRequest = typeof oauthRequest.$inferSelect
export type InsertOAuthRequest = typeof oauthRequest.$inferInsert
