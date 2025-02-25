import {InferResultType} from '@/common/drizzle'
import {InsertOAuthClient} from '@/common/entities'

import {OAuthClientDomain} from '@/oauth/domain/oauth-client'

export class OAuthClientMapper {
  public static toDomain(oauthClientEntity: InferResultType<'oauthClient'>): OAuthClientDomain {
    return new OAuthClientDomain({
      id: oauthClientEntity.id,
      clientId: oauthClientEntity.clientId,
      clientSecret: oauthClientEntity.clientSecret,
      clientName: oauthClientEntity.clientName,
      clientUri: oauthClientEntity.clientUri,
      redirectUri: oauthClientEntity.redirectUri,
      scope: oauthClientEntity.scope,
      isConfidential: oauthClientEntity.isConfidential,
      isActive: oauthClientEntity.isActive,
      updatedAt: oauthClientEntity.updatedAt,
      createdAt: oauthClientEntity.createdAt,
      deletedAt: oauthClientEntity.deletedAt,
      createdBy: oauthClientEntity.createdBy
    })
  }

  public static toEntity(oauthClientDomain: OAuthClientDomain): InsertOAuthClient {
    return {
      clientId: oauthClientDomain.clientId,
      clientName: oauthClientDomain.clientName,
      clientSecret: oauthClientDomain.clientSecret,
      clientUri: oauthClientDomain.clientUri,
      redirectUri: oauthClientDomain.redirectUri,
      scope: oauthClientDomain.scope,
      isConfidential: oauthClientDomain.isConfidential,
      isActive: oauthClientDomain.isActive,
      createdBy: oauthClientDomain.createdBy
    }
  }
}
