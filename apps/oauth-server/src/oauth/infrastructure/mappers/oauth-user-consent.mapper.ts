import {InsertOAuthUserConsent, SelectOAuthUserConsent} from '@/common/entities/oauth-user-consent.entity'

import {OAuthUserConsentDomain} from '@/oauth/domain/oauth-user-consent'

export class OAuthUserConsentMapper {
  toDomain(oauthUserConsentEntity: SelectOAuthUserConsent): OAuthUserConsentDomain {
    return new OAuthUserConsentDomain({
      id: oauthUserConsentEntity.id,
      userId: oauthUserConsentEntity.userId,
      clientId: oauthUserConsentEntity.clientId,
      scope: oauthUserConsentEntity.scope,
      createdAt: oauthUserConsentEntity.createdAt,
      updatedAt: oauthUserConsentEntity.updatedAt,
      deletedAt: oauthUserConsentEntity.deletedAt
    })
  }

  toEntity(oauthUserConsentDomain: OAuthUserConsentDomain): InsertOAuthUserConsent {
    return {
      userId: oauthUserConsentDomain.userId,
      clientId: oauthUserConsentDomain.clientId,
      scope: oauthUserConsentDomain.scope
    }
  }
}
