import {InferResultType} from '@/common/drizzle'
import {InsertOAuthRequest, SelectOAuthClient, SelectOAuthRequest, SelectUser} from '@/common/entities'

import {OAuthClientDomain} from '@/oauth/domain/oauth-client'
import {OAuthRequestDomain} from '@/oauth/domain/oauth-request'
import {UserDomain} from '@/oauth/domain/user'

export class OAuthRequestMapper {
  public static toDomain(
    oauthRequestEntity:
      | InferResultType<'oauthRequest', {oauthClient: true; user: true}>
      | (SelectOAuthRequest & {user?: SelectUser; oauthClient?: SelectOAuthClient})
  ): OAuthRequestDomain {
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
      expiresAt: oauthRequestEntity.expiresAt,
      status: oauthRequestEntity.status,

      user: oauthRequestEntity?.user ? this.mapUserToDomain(oauthRequestEntity.user as SelectUser) : null,

      client: oauthRequestEntity?.oauthClient
        ? this.mapClientToDomain(oauthRequestEntity.oauthClient as SelectOAuthClient)
        : null
    })
  }

  private static mapUserToDomain(user: SelectUser): UserDomain {
    return new UserDomain({
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt
    })
  }

  private static mapClientToDomain(client: SelectOAuthClient): OAuthClientDomain {
    return new OAuthClientDomain({
      id: client.id,
      clientId: client.clientId,
      clientSecret: client.clientSecret,
      redirectUri: client.redirectUri,
      scope: client.scope,
      isActive: client.isActive,
      isConfidential: client.isConfidential,
      clientName: client.clientName,
      clientUri: client.clientUri,
      updatedAt: client.updatedAt,
      createdAt: client.createdAt,
      deletedAt: client.deletedAt,
      createdBy: client.createdBy
    })
  }

  public static toEntity(OAuthRequest: OAuthRequestDomain): InsertOAuthRequest & {id: number} {
    const {
      clientId,
      codeChallenge,
      codeChallengeMethod,
      scope,
      state,
      redirectUri,
      expiresAt,
      userId,
      deletedAt,
      status
    } = OAuthRequest

    return {
      id: OAuthRequest.id,
      clientId,
      codeChallenge,
      codeChallengeMethod,
      status,
      scope,
      state,
      redirectUri,
      expiresAt,
      userId,
      deletedAt
    }
  }
}
