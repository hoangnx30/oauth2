import {boolean, index, integer, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'
import {oauthRequest} from './oauth-request.entity'
import {user} from './user.entity'

export const oauthAuthorizationApproval = oauthSchema.table(
  'oauth_authorization_approvals',
  {
    id: serial().primaryKey(),
    oauthRequestId: integer()
      .notNull()
      .references(() => oauthRequest.id),
    userId: integer('user_id')
      .notNull()
      .references(() => user.id),
    approvedScopes: varchar('approved_scopes').notNull(),
    rememberApproval: boolean('remember_approval').default(false),
    ipAddress: varchar('ip_address', {length: 45}),
    userAgent: text('user_agent'),
    // deviceId: varchar('device_id', {length: 255}), //  -- TODO: For future use should have another table user_devices.
    expiresAt: timestamp('expires_at'), //-- For remember approval feature

    ...timestampColumns
  },
  (table) => [
    index('oauth_authorization-approval_idx_user_id').on(table.userId),
    index('idx_expires').on(table.expiresAt)
  ]
)

export type SelectOAuthAuthorizationApproval = typeof oauthAuthorizationApproval.$inferSelect
export type InsertOAuthAuthorizationApproval = typeof oauthAuthorizationApproval.$inferInsert
