import {Inject} from '@nestjs/common'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {DATABASE_TOKEN} from '@/common/constants/app.constants'
import * as schema from '@/common/entities'
import {SelectOAuthAuthorizationRequest} from '@/common/entities'

import {ICreateOAuthAuthorizationRequest, IOAuthAuthorizationRequestRepository} from '@/oauth/application/interfaces'
import {OAuthAuthorizationRequestDomain} from '@/oauth/domain/oauth-authorization-request'

const {oauthAuthorizationRequestTable} = schema

export class OAuthAuthorizationRequestRepository implements IOAuthAuthorizationRequestRepository {
  constructor(@Inject(DATABASE_TOKEN) private readonly drizzle: NodePgDatabase<typeof schema>) {}

  async save(data: ICreateOAuthAuthorizationRequest): Promise<OAuthAuthorizationRequestDomain> {
    const res = await this.drizzle.insert(oauthAuthorizationRequestTable).values(data).returning()
    return this.toDomain(res[0])
  }

  toDomain(data: SelectOAuthAuthorizationRequest): OAuthAuthorizationRequestDomain {
    return new OAuthAuthorizationRequestDomain(data)
  }
}
