import {Inject, Injectable} from '@nestjs/common'
import {and, eq} from 'drizzle-orm'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {DATABASE_TOKEN} from '@/common/constants/app.constants'
import * as schema from '@/common/entities'
import {SelectUser} from '@/common/entities'

import {ICreateUser, IUserRepository} from '@/oauth/application/interfaces'
import {UserDomain} from '@/oauth/domain/user'

const {userTable} = schema

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@Inject(DATABASE_TOKEN) private readonly drizzle: NodePgDatabase<typeof schema>) {}

  async findActiveUserByUsernameAndEmail(username: string, email: string): Promise<UserDomain | null> {
    const user = await this.drizzle
      .select()
      .from(schema.userTable)
      .where(and(eq(userTable.username, username), eq(userTable.email, email), eq(userTable.isActive, true)))
      .limit(1)

    return user.length ? this.toDomain(user[0]) : null
  }

  async findActiveUserByEmail(email: string): Promise<UserDomain | null> {
    const user = await this.drizzle
      .select()
      .from(schema.userTable)
      .where(and(eq(userTable.email, email), eq(userTable.isActive, true)))
      .limit(1)

    return user.length ? this.toDomain(user[0]) : null
  }

  async save(data: ICreateUser): Promise<UserDomain> {
    const users = await this.drizzle.insert(userTable).values(data).returning()
    return this.toDomain(users[0])
  }

  toDomain(data: SelectUser) {
    return new UserDomain(data)
  }
}
