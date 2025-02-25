import {Inject, Injectable} from '@nestjs/common'
import {and, eq} from 'drizzle-orm'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {DATABASE_TOKEN} from '@/common/constants/app.constants'
import {UnitOfWorkService} from '@/common/drizzle'
import * as schema from '@/common/entities'

import {IUserRepository} from '@/oauth/application/interfaces'
import {UserDomain} from '@/oauth/domain/user'

import {UserMapper} from '../mappers/user.mapper'
import {BaseRepository} from './base.repository'

const {user} = schema

@Injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(@Inject(DATABASE_TOKEN) drizzle: NodePgDatabase<typeof schema>, unitOfWorkService: UnitOfWorkService) {
    super(drizzle, unitOfWorkService)
  }

  async findActiveUserById(id: number): Promise<UserDomain | null> {
    const res = await this.getDatabase().query.user.findFirst({
      where: (fields, {eq, and}) => {
        return and(eq(fields.id, id), eq(fields.isActive, true))
      }
    })

    return res ? UserMapper.toDomain(res) : null
  }

  async findActiveUserByUsernameAndEmail(username: string, email: string): Promise<UserDomain | null> {
    const res = await this.getDatabase()
      .select()
      .from(user)
      .where(and(eq(user.username, username), eq(user.email, email), eq(user.isActive, true)))
      .limit(1)

    return res.length ? UserMapper.toDomain(user[0]) : null
  }

  async findActiveUserByEmail(email: string): Promise<UserDomain | null> {
    const res = await this.getDatabase()
      .select()
      .from(user)
      .where(and(eq(user.email, email), eq(user.isActive, true)))
      .limit(1)

    return res.length ? UserMapper.toDomain(res[0]) : null
  }

  async save(data: UserDomain): Promise<UserDomain> {
    const userRecords = await this.getDatabase()
      .insert(user)
      .values(UserMapper.toEntity(data))
      .onConflictDoUpdate({target: user.id, set: UserMapper.toEntity(data)})
      .returning()
    return UserMapper.toDomain(userRecords[0])
  }
}
