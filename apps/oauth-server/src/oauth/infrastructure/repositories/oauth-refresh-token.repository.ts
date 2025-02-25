import {Inject} from '@nestjs/common'
import {eq} from 'drizzle-orm'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {DATABASE_TOKEN} from '@/common/constants/app.constants'
import {UnitOfWorkService} from '@/common/drizzle'
import {oauthAccessToken} from '@/common/entities'
import * as schema from '@/common/entities'

import {IOAuthRefreshTokenRepository} from '@/oauth/application/interfaces'
import {OAuthRefreshTokenDomain} from '@/oauth/domain/oauth-refresh-token'

import {OAuthRefreshTokenMapper} from '../mappers/oauth-refresh-token.mapper'
import {BaseRepository} from './base.repository'

const {oauthRefreshToken} = schema

export class OAuthRefreshTokenRepository extends BaseRepository implements IOAuthRefreshTokenRepository {
  constructor(@Inject(DATABASE_TOKEN) drizzle: NodePgDatabase<typeof schema>, unitOfWorkService: UnitOfWorkService) {
    super(drizzle, unitOfWorkService)
  }

  async save(data: OAuthRefreshTokenDomain): Promise<OAuthRefreshTokenDomain> {
    const {id, ...rest} = OAuthRefreshTokenMapper.toEntity(data)

    if (!id) {
      const res = await this.getDatabase().insert(oauthRefreshToken).values(rest).returning()
      return OAuthRefreshTokenMapper.toDomain(res[0])
    }

    const res = await this.getDatabase()
      .update(oauthRefreshToken)
      .set(rest)
      .where(eq(oauthRefreshToken.id, id))
      .returning()

    return OAuthRefreshTokenMapper.toDomain(res[0])
  }
}
