import {InsertJwtToken, SelectJwtToken, jwtToken} from '@/common/entities'

import {JwtTokenDomain} from '@/oauth/domain/jwt-token'

export class JwtTokenMapper {
  public static toDomain(jwtTokenEntity: SelectJwtToken): JwtTokenDomain {
    return new JwtTokenDomain({
      id: jwtTokenEntity.id,
      userId: jwtTokenEntity.userId,
      refreshToken: jwtTokenEntity.refreshToken,
      updatedAt: jwtTokenEntity.updatedAt,
      createdAt: jwtTokenEntity.createdAt,
      deletedAt: jwtTokenEntity.deletedAt,
      ipAddress: jwtTokenEntity.ipAddress,
      userAgent: jwtTokenEntity.userAgent,
      expiresAt: jwtTokenEntity.expiresAt,
      revokedAt: jwtTokenEntity.revokedAt
    })
  }

  public static toEntity(jwtTokenDomain: JwtTokenDomain): InsertJwtToken {
    return {
      userId: jwtTokenDomain.userId,
      refreshToken: jwtTokenDomain.refreshToken,
      ipAddress: jwtTokenDomain.ipAddress,
      userAgent: jwtTokenDomain.userAgent,
      expiresAt: jwtTokenDomain.expiresAt,
      revokedAt: jwtTokenDomain.revokedAt
    }
  }
}
