import {Inject} from '@nestjs/common'
import {eq} from 'drizzle-orm'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {DATABASE_TOKEN} from '@/common/constants/app.constants'
import {UnitOfWorkService} from '@/common/drizzle'
import * as schema from '@/common/entities'

import {IOAuthAuthorizationRequestRepository} from '@/oauth/application/interfaces'
import {OAuthRequestDomain} from '@/oauth/domain/oauth-request'

import {OAuthRequestMapper} from '../mappers/oauth-request.mapper'
import {BaseRepository} from './base.repository'

const {oauthRequest} = schema

export class OAuthRequestRepository extends BaseRepository implements IOAuthAuthorizationRequestRepository {
  constructor(@Inject(DATABASE_TOKEN) drizzle: NodePgDatabase<typeof schema>, unitOfWorkService: UnitOfWorkService) {
    super(drizzle, unitOfWorkService)
  }

  async findById(id: number): Promise<OAuthRequestDomain | null> {
    const oauthAuthorizationRequest = await this.getDatabase().query.oauthRequest.findFirst({
      where: (oauthRequest, {eq}) => {
        return eq(oauthRequest.id, id)
      }
    })

    return oauthAuthorizationRequest ? OAuthRequestMapper.toDomain(oauthAuthorizationRequest) : null
  }

  async save(data: OAuthRequestDomain): Promise<OAuthRequestDomain> {
    const {id, ...rest} = OAuthRequestMapper.toEntity(data)

    if (!id) {
      const res = await this.getDatabase().insert(oauthRequest).values(rest).returning()

      return OAuthRequestMapper.toDomain(res[0])
    }

    const res = await this.getDatabase().update(oauthRequest).set(rest).where(eq(oauthRequest.id, id)).returning()

    return OAuthRequestMapper.toDomain(res[0])
  }
}
