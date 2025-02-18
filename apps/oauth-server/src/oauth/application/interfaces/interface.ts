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

export interface IOAuthAuthorizationRequestRepository {}

export interface IOAuthStateRepository {}
