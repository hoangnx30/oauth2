import {InsertOAuthAccessToken, SelectOAuthAccessToken} from '@/common/entities'

import {OAuthAccessTokenDomain} from '@/oauth/domain/oauth-access-token'

export class OAuthAccessTokenMapper {
  public static toDomain(oathAccessTokenEntity: SelectOAuthAccessToken): OAuthAccessTokenDomain {
    return new OAuthAccessTokenDomain({
      id: oathAccessTokenEntity.id,
      accessToken: oathAccessTokenEntity.accessToken,
      scope: oathAccessTokenEntity.scope,
      expiresAt: oathAccessTokenEntity.expiresAt,
      clientId: oathAccessTokenEntity.clientId,
      userId: oathAccessTokenEntity.userId,
      isRevoked: oathAccessTokenEntity.isRevoked,
      createdAt: oathAccessTokenEntity.createdAt,
      updatedAt: oathAccessTokenEntity.updatedAt,
      deletedAt: oathAccessTokenEntity.deletedAt
    })
  }

  public static toEntity(oauthAccessTokenDomain): InsertOAuthAccessToken & {id?: number} {
    return {
      id: oauthAccessTokenDomain.id,
      accessToken: oauthAccessTokenDomain.accessToken,
      scope: oauthAccessTokenDomain.scope,
      expiresAt: oauthAccessTokenDomain.expiresAt,
      clientId: oauthAccessTokenDomain.clientId,
      userId: oauthAccessTokenDomain.userId,
      isRevoked: oauthAccessTokenDomain.isRevoked,
      deletedAt: oauthAccessTokenDomain.deletedAt
    }
  }
}
