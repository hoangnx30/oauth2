import {boolean, serial, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'

export const user = oauthSchema.table('users', {
  id: serial().primaryKey(),
  username: varchar({length: 255}).unique().notNull(),
  passwordHash: varchar('password_hash').notNull(),
  email: varchar({length: 255}).notNull(),
  isActive: boolean('is_active').default(true),
  ...timestampColumns
})

export type SelectUser = typeof user.$inferSelect
export type InsertUser = typeof user.$inferInsert
