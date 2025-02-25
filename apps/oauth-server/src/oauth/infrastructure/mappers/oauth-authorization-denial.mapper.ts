import {
  InsertOAuthAuthorizationDenial,
  SelectOAuthAuthorizationDenial
} from '@/common/entities/oauth-authorization-denial.entity'

import {OAuthAuthorizationDenialDomain} from '@/oauth/domain/oauth-authorization-denial'

export class OAuthAuthorizationDenialMapper {
  public static toDomain(
    oauthAuthorizationDenialEntity: SelectOAuthAuthorizationDenial
  ): OAuthAuthorizationDenialDomain {
    return new OAuthAuthorizationDenialDomain({
      id: oauthAuthorizationDenialEntity.id,
      userId: oauthAuthorizationDenialEntity.userId,
      createdAt: oauthAuthorizationDenialEntity.createdAt,
      updatedAt: oauthAuthorizationDenialEntity.updatedAt,
      deletedAt: oauthAuthorizationDenialEntity.deletedAt,
      ipAddress: oauthAuthorizationDenialEntity.ipAddress,
      userAgent: oauthAuthorizationDenialEntity.userAgent,
      authorizationRequestId: oauthAuthorizationDenialEntity.authorizationRequestId,
      denialReason: oauthAuthorizationDenialEntity.denialReason,
      rememberDenial: oauthAuthorizationDenialEntity.rememberDenial
    })
  }

  public static toEntity(
    oauthAuthorizationDenialDomain: OAuthAuthorizationDenialDomain
  ): InsertOAuthAuthorizationDenial {
    return {
      userId: oauthAuthorizationDenialDomain.userId,
      ipAddress: oauthAuthorizationDenialDomain.ipAddress,
      userAgent: oauthAuthorizationDenialDomain.userAgent,
      authorizationRequestId: oauthAuthorizationDenialDomain.authorizationRequestId,
      denialReason: oauthAuthorizationDenialDomain.denialReason,
      rememberDenial: oauthAuthorizationDenialDomain.rememberDenial
    }
  }
}
