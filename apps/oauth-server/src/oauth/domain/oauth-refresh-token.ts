import * as crypto from 'crypto'

import DateTimeUtils from '@/common/utils/datetime'

type OAuthRefreshToken = {
  id: number
  refreshToken: string
  clientId: number
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  userId: number
  expiresAt: Date
  isRevoked: boolean | null
  accessTokenId: number
}

export class OAuthRefreshTokenDomain {
  id: number
  refreshToken: string
  clientId: number
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  userId: number
  expiresAt: Date
  isRevoked: boolean | null
  accessTokenId: number

  constructor(data: Partial<OAuthRefreshToken>) {
    Object.assign(this, data)
  }

  generateRefreshToken(): void {
    this.refreshToken = crypto.randomBytes(64).toString('hex')
  }

  initExpiresAt(): void {
    this.expiresAt = DateTimeUtils.utc().add(1, 'month').toDate()
  }
}
