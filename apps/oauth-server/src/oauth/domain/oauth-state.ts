type OAuthState = {
  id: string
  clientId: string
  updateAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  state: string
  expiresAt: Date
  isUsed: boolean | null
}

export class OAuthStateDomain {
  id: string
  clientId: string
  updateAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  state: string
  expiresAt: Date
  isUsed: boolean | null

  constructor(properties: OAuthState) {
    Object.assign(this, properties)
  }
}
