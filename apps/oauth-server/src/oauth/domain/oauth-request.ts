import * as crypto from 'crypto'

import {ErrorCode, HttpException} from '@/common/errors'

import {OAuthClientDomain} from './oauth-client'
import {UserDomain} from './user'

export type OAuthRequest = {
  codeChallengeMethod: string | null
  codeChallenge: string | null
  clientId: number
  redirectUri: string
  expiresAt: Date
  scope: string
  id: number
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  userId: number | null
  state: string
  status: 'initiated' | 'authenticated' | 'pending' | 'approved' | 'denied' | 'expired'

  user: UserDomain | null
  client: OAuthClientDomain | null
}

export class OAuthRequestDomain {
  codeChallengeMethod: string | null
  codeChallenge: string | null
  clientId: number
  redirectUri: string
  expiresAt: Date
  scope: string
  id: number
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  userId: number | null
  state: string
  status: 'initiated' | 'authenticated' | 'approved' | 'denied' | 'expired'

  user: UserDomain | null
  client: OAuthClientDomain | null

  constructor(properties: Partial<OAuthRequest>) {
    Object.assign(this, properties)
  }

  verifyCodeChallenge(codeVerifier: string) {
    let hash: string = ''
    switch (this.codeChallengeMethod) {
      case 'S256':
        hash = crypto
          .createHash('sha256')
          .update(codeVerifier)
          .digest('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '')
        break

      case 'plain':
        hash = codeVerifier
        break

      default:
        throw new HttpException(ErrorCode.NotSupportedCodeChallengeMethod)
    }

    if (hash !== this.codeChallenge) {
      throw new HttpException(ErrorCode.InvalidCodeVerifier)
    }
  }
}
