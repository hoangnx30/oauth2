import {Inject} from '@nestjs/common'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {DATABASE_TOKEN} from '@/common/constants/app.constants'
import {UnitOfWorkService} from '@/common/drizzle'
import * as schema from '@/common/entities'
import {InsertJwtToken, SelectJwtToken} from '@/common/entities'

import {IJwtTokenRepository} from '@/oauth/application/interfaces'
import {JwtTokenDomain} from '@/oauth/domain/jwt-token'

import {JwtTokenMapper} from '../mappers/jwt-token.mapper'
import {BaseRepository} from './base.repository'

const {jwtToken} = schema

export class JwtTokenRepository extends BaseRepository implements IJwtTokenRepository {
  constructor(@Inject(DATABASE_TOKEN) drizzle: NodePgDatabase<typeof schema>, unitOfWorkService: UnitOfWorkService) {
    super(drizzle, unitOfWorkService)
  }

  async save(data: JwtTokenDomain): Promise<JwtTokenDomain> {
    const res = await this.getDatabase().insert(jwtToken).values(JwtTokenMapper.toEntity(data)).returning()
    return JwtTokenMapper.toDomain(res[0])
  }
}
