import {Inject, Injectable} from '@nestjs/common'
import {and, eq} from 'drizzle-orm'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {DATABASE_TOKEN} from '@/common/constants/app.constants'
import {UnitOfWorkService} from '@/common/drizzle'
import * as schema from '@/common/entities'
import {SelectOAuthClient} from '@/common/entities'

import {IOAuthClientRepository} from '@/oauth/application/interfaces'
import {OAuthClientDomain} from '@/oauth/domain/oauth-client'

import {OAuthClientMapper} from '../mappers/oauth-client.mapper'
import {BaseRepository} from './base.repository'

const {oauthClient} = schema

@Injectable()
export class OAuthClientRepository extends BaseRepository implements IOAuthClientRepository {
  constructor(@Inject(DATABASE_TOKEN) drizzle: NodePgDatabase<typeof schema>, unitOfWorkService: UnitOfWorkService) {
    super(drizzle, unitOfWorkService)
  }

  async findActiveOAuthClientByClientId(clientId: string): Promise<OAuthClientDomain> {
    const data: SelectOAuthClient[] = await this.getDatabase()
      .select()
      .from(oauthClient)
      .where(and(eq(oauthClient.clientId, clientId), eq(oauthClient.isActive, true)))

    return OAuthClientMapper.toDomain(data[0])
  }

  async save(data: OAuthClientDomain): Promise<OAuthClientDomain> {
    const res: SelectOAuthClient[] = await this.getDatabase()
      .insert(oauthClient)
      .values(OAuthClientMapper.toEntity(data))
      .returning()
    return OAuthClientMapper.toDomain(res[0])
  }
}
