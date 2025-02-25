import {Inject} from '@nestjs/common'
import {eq} from 'drizzle-orm'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {DATABASE_TOKEN} from '@/common/constants/app.constants'
import {UnitOfWorkService} from '@/common/drizzle'
import * as schema from '@/common/entities'

import {IOAuthAccessTokenRepository} from '@/oauth/application/interfaces'
import {OAuthAccessTokenDomain} from '@/oauth/domain/oauth-access-token'

import {OAuthAccessTokenMapper} from '../mappers/oauth-access-token.mapper'
import {BaseRepository} from './base.repository'

const {oauthAccessToken} = schema

export class OAuthAccessTokenRepository extends BaseRepository implements IOAuthAccessTokenRepository {
  constructor(@Inject(DATABASE_TOKEN) drizzle: NodePgDatabase<typeof schema>, unitOfWorkService: UnitOfWorkService) {
    super(drizzle, unitOfWorkService)
  }

  async save(data: OAuthAccessTokenDomain): Promise<OAuthAccessTokenDomain> {
    const {id, ...rest} = OAuthAccessTokenMapper.toEntity(data)

    if (!id) {
      const res = await this.getDatabase().insert(oauthAccessToken).values(rest).returning()

      return OAuthAccessTokenMapper.toDomain(res[0])
    }

    const res = await this.getDatabase()
      .update(oauthAccessToken)
      .set(rest)
      .where(eq(oauthAccessToken.id, id))
      .returning()

    console.log(res)

    return OAuthAccessTokenMapper.toDomain(res[0])
  }
}
