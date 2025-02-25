import {InsertOAuthRefreshToken, SelectOAuthRefreshToken} from '@/common/entities'

import {OAuthRefreshTokenDomain} from '@/oauth/domain/oauth-refresh-token'

export class OAuthRefreshTokenMapper {
  public static toDomain(oauthRefreshToken: SelectOAuthRefreshToken): OAuthRefreshTokenDomain {
    return new OAuthRefreshTokenDomain({
      id: oauthRefreshToken.id,
      refreshToken: oauthRefreshToken.refreshToken,
      accessTokenId: oauthRefreshToken.accessTokenId,
      expiresAt: oauthRefreshToken.expiresAt,
      clientId: oauthRefreshToken.clientId,
      userId: oauthRefreshToken.userId,
      isRevoked: oauthRefreshToken.isRevoked,
      createdAt: oauthRefreshToken.createdAt,
      updatedAt: oauthRefreshToken.updatedAt,
      deletedAt: oauthRefreshToken.deletedAt
    })
  }

  public static toEntity(oauthRefreshTokenDomain: OAuthRefreshTokenDomain): InsertOAuthRefreshToken & {id?: string} {
    return {
      refreshToken: oauthRefreshTokenDomain.refreshToken,
      accessTokenId: oauthRefreshTokenDomain.accessTokenId,
      expiresAt: oauthRefreshTokenDomain.expiresAt,
      clientId: oauthRefreshTokenDomain.clientId,
      userId: oauthRefreshTokenDomain.userId,
      isRevoked: oauthRefreshTokenDomain.isRevoked,
      deletedAt: oauthRefreshTokenDomain.deletedAt
    }
  }
}
