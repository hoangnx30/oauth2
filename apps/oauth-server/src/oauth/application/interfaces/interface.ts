import {JwtTokenDomain} from '@/oauth/domain/jwt-token'
import {OAuthAccessTokenDomain} from '@/oauth/domain/oauth-access-token'
import {OAuthAuthorizationApprovalDomain} from '@/oauth/domain/oauth-authorization-approval'
import {OAuthClientDomain} from '@/oauth/domain/oauth-client'
import {OAuthCodeDomain} from '@/oauth/domain/oauth-code'
import {OAuthRefreshTokenDomain} from '@/oauth/domain/oauth-refresh-token'
import {OAuthRequest, OAuthRequestDomain} from '@/oauth/domain/oauth-request'
import {UserDomain} from '@/oauth/domain/user'

export interface IOAuthClientRepository {
  findActiveOAuthClientByClientId(clientId: string): Promise<OAuthClientDomain>
  save(data: OAuthClientDomain): Promise<OAuthClientDomain>
}

export interface IUserRepository {
  findActiveUserById(id: number): Promise<UserDomain | null>
  findActiveUserByUsernameAndEmail(username: string, email: string): Promise<UserDomain | null>
  save(data: UserDomain): Promise<UserDomain>
  findActiveUserByEmail(email: string): Promise<UserDomain | null>
}

export interface IJwtTokenRepository {
  save(data: JwtTokenDomain): Promise<JwtTokenDomain>
}

export interface IOAuthAuthorizationRequestRepository {
  save(data: OAuthRequestDomain): Promise<OAuthRequestDomain>
  findById(id: number): Promise<OAuthRequestDomain | null>
}

export interface IOAuthAccessTokenRepository {
  save(data: OAuthAccessTokenDomain): Promise<OAuthAccessTokenDomain>
}

export interface IOAuthRefreshTokenRepository {
  save(data: OAuthRefreshTokenDomain): Promise<OAuthRefreshTokenDomain>
}

export interface IOAuthCodeRepository {
  save(data: OAuthCodeDomain): Promise<OAuthCodeDomain>
  findUnUsedCodeByCode(code: string): Promise<OAuthCodeDomain | null>
}

export interface IOAuthAuthorizationApprovalRepository {
  save(data: OAuthAuthorizationApprovalDomain): Promise<OAuthAuthorizationApprovalDomain>
}
