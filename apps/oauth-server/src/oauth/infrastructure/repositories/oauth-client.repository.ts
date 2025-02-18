import {Inject, Injectable} from '@nestjs/common'
import {and, eq} from 'drizzle-orm'
import {NodePgDatabase} from 'drizzle-orm/node-postgres'

import {DATABASE_TOKEN} from '@/common/constants/app.constants'
import * as schema from '@/common/entities'
import {SelectOAuthClient} from '@/common/entities'

import {ICreateOAuthClient, IOAuthClientRepository} from '@/oauth/application/interfaces'
import {OAuthClientDomain} from '@/oauth/domain/oauth-client'

const {oauthClientTable} = schema

@Injectable()
export class OAuthClientRepository implements IOAuthClientRepository {
  constructor(@Inject(DATABASE_TOKEN) private readonly drizzle: NodePgDatabase<typeof schema>) {}

  async findActiveOAuthClientByClientId(clientId: string): Promise<OAuthClientDomain[]> {
    const data: SelectOAuthClient[] = await this.drizzle
      .select()
      .from(oauthClientTable)
      .where(and(eq(oauthClientTable.clientId, clientId), eq(oauthClientTable.isActive, true)))

    return data.map((d) => this.toDomain(d))
  }

  async save(data: ICreateOAuthClient): Promise<SelectOAuthClient> {
    const res: SelectOAuthClient[] = await this.drizzle.insert(oauthClientTable).values(data).returning()
    return this.toDomain(res[0])
  }

  toDomain(data: SelectOAuthClient): OAuthClientDomain {
    return new OAuthClientDomain(data)
  }
}
