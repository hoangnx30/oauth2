import {Inject} from '@nestjs/common'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {DATABASE_TOKEN} from '@/common/constants/app.constants'
import * as schema from '@/common/entities'
import {SelectJwtToken} from '@/common/entities'

import {ICreateJwtToken, IJwtTokenRepository} from '@/oauth/application/interfaces'
import {JwtTokenDomain} from '@/oauth/domain/jwt-token'

const {jwtTokenTable} = schema

export class JwtTokenRepository implements IJwtTokenRepository {
  constructor(@Inject(DATABASE_TOKEN) private readonly drizzle: NodePgDatabase<typeof schema>) {}

  async save(data: ICreateJwtToken): Promise<JwtTokenDomain> {
    const res = await this.drizzle.insert(jwtTokenTable).values(data).returning()
    return this.toDomain(res[0])
  }

  toDomain(data: SelectJwtToken) {
    return new JwtTokenDomain(data)
  }
}
