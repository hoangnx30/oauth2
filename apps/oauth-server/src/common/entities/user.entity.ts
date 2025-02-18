import {boolean, uuid, varchar} from 'drizzle-orm/pg-core'

import {oauthSchema, timestampColumns} from './base.entity'

export const userTable = oauthSchema.table('users', {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({length: 255}).unique().notNull(),
  passwordHash: varchar('password_hash').notNull(),
  email: varchar({length: 255}).notNull(),
  isActive: boolean('is_active').default(true),
  ...timestampColumns
})

export type SelectUser = typeof userTable.$inferSelect
export type InsertUser = typeof userTable.$inferInsert
