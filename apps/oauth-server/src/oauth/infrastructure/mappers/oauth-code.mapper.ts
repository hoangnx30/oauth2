import {InferResultType} from '@/common/drizzle'
import {SelectOAuthRequest} from '@/common/entities'
import {InsertOAuthAuthorizationCode, SelectOAuthCode} from '@/common/entities/oauth-code.entity'

import {OAuthCodeDomain} from '@/oauth/domain/oauth-code'
import {OAuthRequestDomain} from '@/oauth/domain/oauth-request'

export class OAuthAuthorizationCodeMapper {
  public static toDomain(
    oauthCodeEntity:
      | InferResultType<'oauthCode', {oauthRequest: true}>
      | (SelectOAuthCode & {oauthRequest?: SelectOAuthRequest})
  ): OAuthCodeDomain {
    return new OAuthCodeDomain({
      id: oauthCodeEntity.id,
      code: oauthCodeEntity.code,
      clientId: oauthCodeEntity.clientId,
      oauthRequestId: oauthCodeEntity.oauthRequestId,
      userId: oauthCodeEntity.userId,
      expiresAt: oauthCodeEntity.expiresAt,
      createdAt: oauthCodeEntity.createdAt,
      updatedAt: oauthCodeEntity.updatedAt,
      deletedAt: oauthCodeEntity.deletedAt,
      isUsed: oauthCodeEntity.isUsed,

      oauthRequest: oauthCodeEntity.oauthRequest
        ? this.mapOAuthClientToOAuthClientDomain(oauthCodeEntity.oauthRequest)
        : null
    })
  }

  private static mapOAuthClientToOAuthClientDomain(oauthRequestEntity: SelectOAuthRequest): OAuthRequestDomain {
    return new OAuthRequestDomain({
      id: oauthRequestEntity.id,
      clientId: oauthRequestEntity.clientId,
      redirectUri: oauthRequestEntity.redirectUri,
      scope: oauthRequestEntity.scope,
      updatedAt: oauthRequestEntity.updatedAt,
      createdAt: oauthRequestEntity.createdAt,
      deletedAt: oauthRequestEntity.deletedAt,
      userId: oauthRequestEntity.userId,
      codeChallenge: oauthRequestEntity.codeChallenge,
      codeChallengeMethod: oauthRequestEntity.codeChallengeMethod,
      state: oauthRequestEntity.state,
      expiresAt: oauthRequestEntity.expiresAt
    })
  }

  public static toEntity(oauthAuthorizationDomain: OAuthCodeDomain): InsertOAuthAuthorizationCode {
    return {
      id: oauthAuthorizationDomain.id,
      code: oauthAuthorizationDomain.code,
      oauthRequestId: oauthAuthorizationDomain.oauthRequestId,
      clientId: oauthAuthorizationDomain.clientId,
      userId: oauthAuthorizationDomain.userId,
      expiresAt: oauthAuthorizationDomain.expiresAt,
      isUsed: oauthAuthorizationDomain.isUsed,
      deletedAt: oauthAuthorizationDomain.deletedAt
    }
  }
}
