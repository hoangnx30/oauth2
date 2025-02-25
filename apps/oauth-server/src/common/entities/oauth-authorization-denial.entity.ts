import {boolean, index, integer, serial, timestamp, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'
import {oauthRequest} from './oauth-request.entity'
import {user} from './user.entity'

export const oauthAuthorizationDenial = oauthSchema.table(
  'oauth_authorization_denials',
  {
    id: serial('id').primaryKey(),
    authorizationRequestId: integer('authorization_request_id')
      .notNull()
      .references(() => oauthRequest.id),
    userId: integer('user_id')
      .notNull()
      .references(() => user.id),
    denialReason: varchar('denial_reason', {length: 1000}),
    ipAddress: varchar('ip_address', {length: 45}),
    userAgent: varchar('user_agent', {length: 65535}),
    // deviceId: varchar('device_id', {length: 255}), // -- TODO: For future use should have another table user_devices.
    rememberDenial: boolean('remember_denial').default(false),
    ...timestampColumns
  },
  (table) => [index('oauth_authorization_denials_idx_user_id').on(table.userId)]
)

export type SelectOAuthAuthorizationDenial = typeof oauthAuthorizationDenial.$inferSelect
export type InsertOAuthAuthorizationDenial = typeof oauthAuthorizationDenial.$inferInsert
