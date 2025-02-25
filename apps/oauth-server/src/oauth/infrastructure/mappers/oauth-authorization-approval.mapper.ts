import {
  InsertOAuthAuthorizationApproval,
  SelectOAuthAuthorizationApproval
} from '@/common/entities/oauth-authorization-approval.entity'

import {OAuthAuthorizationApprovalDomain} from '@/oauth/domain/oauth-authorization-approval'

export class OAuthAuthorizationApprovalMapper {
  public static toDomain(
    oauthAuthorizationApprovalEntity: SelectOAuthAuthorizationApproval
  ): OAuthAuthorizationApprovalDomain {
    return new OAuthAuthorizationApprovalDomain({
      id: oauthAuthorizationApprovalEntity.id,
      userId: oauthAuthorizationApprovalEntity.userId,
      expiresAt: oauthAuthorizationApprovalEntity.expiresAt,
      createdAt: oauthAuthorizationApprovalEntity.createdAt,
      updatedAt: oauthAuthorizationApprovalEntity.updatedAt,
      deletedAt: oauthAuthorizationApprovalEntity.deletedAt,
      oauthRequestId: oauthAuthorizationApprovalEntity.oauthRequestId,
      approvedScopes: oauthAuthorizationApprovalEntity.approvedScopes,
      rememberApproval: oauthAuthorizationApprovalEntity.rememberApproval
    })
  }

  public static toEntity(
    oauthAuthorizationApprovalDomain: OAuthAuthorizationApprovalDomain
  ): InsertOAuthAuthorizationApproval {
    return {
      userId: oauthAuthorizationApprovalDomain.userId,
      expiresAt: oauthAuthorizationApprovalDomain.expiresAt,
      oauthRequestId: oauthAuthorizationApprovalDomain.oauthRequestId,
      approvedScopes: oauthAuthorizationApprovalDomain.approvedScopes,
      rememberApproval: oauthAuthorizationApprovalDomain.rememberApproval
    }
  }
}
