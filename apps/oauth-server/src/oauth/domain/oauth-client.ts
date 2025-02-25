import * as crypto from 'crypto'

type OAuthClient = {
  id: number
  clientId: string
  clientSecret: string | null
  clientName: string
  clientUri: string | null
  redirectUri: string
  scope: string | null
  isConfidential: boolean | null
  isActive: boolean | null
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  createdBy: number
}

export class OAuthClientDomain {
  id: number
  clientId: string
  clientSecret: string | null
  clientName: string
  clientUri: string | null
  redirectUri: string
  scope: string | null
  isConfidential: boolean
  isActive: boolean | null
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  createdBy: number

  constructor(properties: Partial<OAuthClient>) {
    Object.assign(this, properties)
  }

  generateClientId() {
    this.clientId = crypto.randomBytes(32).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  generateClientSecret() {
    console.log(this.isConfidential)
    this.clientSecret = this.isConfidential
      ? crypto.randomBytes(48).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      : null
  }
}
