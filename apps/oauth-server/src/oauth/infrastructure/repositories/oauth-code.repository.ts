import {Inject} from '@nestjs/common'
import {eq} from 'drizzle-orm'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {DATABASE_TOKEN} from '@/common/constants/app.constants'
import {UnitOfWorkService} from '@/common/drizzle'
import * as schema from '@/common/entities'
import {oauthCode} from '@/common/entities/oauth-code.entity'

import {IOAuthCodeRepository} from '@/oauth/application/interfaces'
import {OAuthCodeDomain} from '@/oauth/domain/oauth-code'

import {OAuthAuthorizationCodeMapper} from '../mappers/oauth-code.mapper'
import {BaseRepository} from './base.repository'

export class OAuthAuthorizationCodeRepository extends BaseRepository implements IOAuthCodeRepository {
  constructor(@Inject(DATABASE_TOKEN) drizzle: NodePgDatabase<typeof schema>, unitOfWorkService: UnitOfWorkService) {
    super(drizzle, unitOfWorkService)
  }

  async findUnUsedCodeByCode(code: string): Promise<OAuthCodeDomain | null> {
    const res = await this.getDatabase().query.oauthCode.findFirst({
      where: (oauthAuthorizationCode, {eq}) => {
        return eq(oauthAuthorizationCode.code, code) && eq(oauthAuthorizationCode.isUsed, false)
      },
      with: {oauthRequest: true}
    })

    return res ? OAuthAuthorizationCodeMapper.toDomain(res) : null
  }

  async save(authorizationCodeDomain: OAuthCodeDomain): Promise<OAuthCodeDomain> {
    const {id, ...rest} = OAuthAuthorizationCodeMapper.toEntity(authorizationCodeDomain)

    const res = await this.getDatabase().update(oauthCode).set(rest).where(eq(oauthCode.id, id!)).returning()

    return OAuthAuthorizationCodeMapper.toDomain(res[0])
  }
}
