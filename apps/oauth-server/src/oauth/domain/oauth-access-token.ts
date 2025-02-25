import * as crypto from 'crypto'

import DateTimeUtils from '@/common/utils/datetime'

type OAuthAccessToken = {
  clientId: number
  accessToken: string
  id: number
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  userId: number | null
  scope: string | null
  expiresAt: Date
  isRevoked: boolean | null
}

export class OAuthAccessTokenDomain {
  clientId: number
  accessToken: string
  id: number
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  userId: number
  scope: string | null
  expiresAt: Date
  isRevoked: boolean | null

  codeVerifer: string
  codeChallenge: string
  codeChallengeMethod: string = 'SHA-256'

  constructor(properties: Partial<OAuthAccessToken>) {
    Object.assign(this, properties)
  }

  generateAccessToken(): void {
    this.accessToken = crypto.randomBytes(32).toString('hex')
  }

  initExpiresAt(): void {
    this.expiresAt = DateTimeUtils.utc().add(1, 'hour').toDate()
  }
}
