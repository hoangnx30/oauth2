import * as crypto from 'crypto'

import DateTimeUtils from '@/common/utils/datetime'

import {OAuthRequestDomain} from './oauth-request'

type OAuthCode = {
  id: number
  oauthRequestId: number
  clientId: number
  userId: number | null
  expiresAt: Date
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  isUsed: boolean | null
  code: string

  oauthRequest: OAuthRequestDomain | null
}

export class OAuthCodeDomain {
  id: number
  oauthRequestId: number
  clientId: number
  userId: number | null
  expiresAt: Date
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  isUsed: boolean | null
  code: string

  oauthRequest: OAuthRequestDomain | null

  constructor(properties: Partial<OAuthCode>) {
    Object.assign(this, properties)
  }

  generateCode() {
    this.code = crypto.randomBytes(16).toString('hex')
  }

  initExpiresAt() {
    this.expiresAt = DateTimeUtils.utc().add(10, 'minutes').toDate()
  }
}
