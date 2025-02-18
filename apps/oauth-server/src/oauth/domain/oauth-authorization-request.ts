import {AggregateRoot} from '@nestjs/cqrs'

type OAuthorizationRequest = {
  id: string
  clientId: string
  redirectUri: string
  scope: string | null
  updateAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  userId: string
  code: string
  codeChallenge: string | null
  codeChallengeMethod: string | null
  state: string | null
  expiresAt: Date
}

export class OAuthAuthorizationRequestDomain extends AggregateRoot {
  id: string
  clientId: string
  redirectUri: string
  scope: string | null
  updateAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  userId: string
  code: string
  codeChallenge: string | null
  codeChallengeMethod: string | null
  state: string | null
  expiresAt: Date

  constructor(properties: OAuthorizationRequest) {
    super()
    Object.assign(this, properties)
  }
}
