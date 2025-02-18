type OAuthClient = {
  id: string
  clientId: string
  clientSecret: string | null
  clientName: string
  clientUri: string | null
  redirectUri: string
  scope: string | null
  isConfidential: boolean | null
  isActive: boolean | null
  updateAt: Date | null
  createdAt: Date
  deletedAt: Date | null
}

export class OAuthClientDomain {
  id: string
  clientId: string
  clientSecret: string | null
  clientName: string
  clientUri: string | null
  redirectUri: string
  scope: string | null
  isConfidential: boolean
  isActive: boolean | null
  updateAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  createdBy: string

  constructor(properties: OAuthClient) {
    Object.assign(this, properties)
  }
}
