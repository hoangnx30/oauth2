type OAuthUserConsent = {
  id: number
  clientId: number
  userId: number
  scope: string
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
}

export class OAuthUserConsentDomain {
  id: number
  clientId: number
  userId: number
  scope: string
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null

  constructor(properties: Partial<OAuthUserConsent>) {
    Object.assign(this, properties)
  }
}
