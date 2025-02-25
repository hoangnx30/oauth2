type OAuthAuthorizationApproval = {
  id: number
  userId: number | null
  expiresAt: Date | null
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  oauthRequestId: number
  approvedScopes: string
  rememberApproval: boolean | null
}

export class OAuthAuthorizationApprovalDomain {
  id: number
  userId: number
  expiresAt: Date | null
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  oauthRequestId: number
  approvedScopes: string
  rememberApproval: boolean | null

  constructor(properties: Partial<OAuthAuthorizationApproval>) {
    Object.assign(this, properties)
  }
}
