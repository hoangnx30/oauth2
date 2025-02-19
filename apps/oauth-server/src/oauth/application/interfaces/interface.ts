import {JwtTokenDomain} from '@/oauth/domain/jwt-token'
import {OAuthAuthorizationRequestDomain} from '@/oauth/domain/oauth-authorization-request'
import {OAuthClientDomain} from '@/oauth/domain/oauth-client'
import {UserDomain} from '@/oauth/domain/user'

export interface ICreateOAuthClient {
  clientId: string
  clientSecret: string | null
  clientName: string
  clientUri: string | null
  redirectUri: string
  scope?: string
  createdBy: string
  isConfidential: boolean
}

export interface IOAuthClientRepository {
  findActiveOAuthClientByClientId(clientId: string): Promise<OAuthClientDomain[]>
  save(data: ICreateOAuthClient): Promise<OAuthClientDomain>
}

export interface ICreateUser {
  username: string
  email: string
  passwordHash: string
}

export interface IUserRepository {
  findActiveUserByUsernameAndEmail(username: string, email: string): Promise<UserDomain | null>
  save(data: ICreateUser): Promise<UserDomain>
  findActiveUserByEmail(email: string): Promise<UserDomain | null>
}

export interface ICreateJwtToken {
  refreshToken: string | null
  userId: string
  ipAddress: string | null
  userAgent: string | null
  expiresAt: Date | null
}

export interface IJwtTokenRepository {
  save(data: ICreateJwtToken): Promise<JwtTokenDomain>
}

export interface ICreateOAuthAuthorizationRequest {
  clientId: string
  userId: string
  code
  codeChallenge: string
  codeChallengeMethod: string
  redirectUri: string
  scope?: string
  state: string
  expiresAt: Date
}

export interface IOAuthAuthorizationRequestRepository {
  save(data: ICreateOAuthAuthorizationRequest): Promise<OAuthAuthorizationRequestDomain>
}

export interface IOAuthStateRepository {}
