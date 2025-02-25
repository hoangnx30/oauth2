import {Inject} from '@nestjs/common'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {DATABASE_TOKEN} from '@/common/constants/app.constants'
import {UnitOfWorkService} from '@/common/drizzle'
import * as schema from '@/common/entities'

import {IOAuthAuthorizationApprovalRepository} from '@/oauth/application/interfaces'
import {OAuthAuthorizationApprovalDomain} from '@/oauth/domain/oauth-authorization-approval'

import {OAuthAuthorizationApprovalMapper} from '../mappers/oauth-authorization-approval.mapper'
import {BaseRepository} from './base.repository'

const {oauthAuthorizationApproval} = schema

export class OAuthAuthorizationApprovalRepository
  extends BaseRepository
  implements IOAuthAuthorizationApprovalRepository
{
  constructor(@Inject(DATABASE_TOKEN) drizzle: NodePgDatabase<typeof schema>, unitOfWorkService: UnitOfWorkService) {
    super(drizzle, unitOfWorkService)
  }

  async save(data: OAuthAuthorizationApprovalDomain): Promise<OAuthAuthorizationApprovalDomain> {
    const res = await this.getDatabase()
      .insert(oauthAuthorizationApproval)
      .values(OAuthAuthorizationApprovalMapper.toEntity(data))
      .onConflictDoUpdate({target: oauthAuthorizationApproval.id, set: OAuthAuthorizationApprovalMapper.toEntity(data)})
      .returning()

    return OAuthAuthorizationApprovalMapper.toDomain(res[0])
  }
}
