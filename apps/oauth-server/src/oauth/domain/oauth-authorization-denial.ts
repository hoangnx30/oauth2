type OAuthAuthorizationDenial = {
  id: number
  userId: number
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  ipAddress: string | null
  userAgent: string | null
  authorizationRequestId: number
  denialReason: string | null
  rememberDenial: boolean | null
}

export class OAuthAuthorizationDenialDomain {
  id: number
  userId: number
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  ipAddress: string | null
  userAgent: string | null
  authorizationRequestId: number
  denialReason: string | null
  rememberDenial: boolean | null

  constructor(properties: Partial<OAuthAuthorizationDenial>) {
    Object.assign(this, properties)
  }
}
