type JwtToken = {
  id: number
  refreshToken: string | null
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  userId: number
  ipAddress: string | null
  userAgent: string | null
  expiresAt: Date | null
  revokedAt: Date | null
}

export class JwtTokenDomain {
  id: number
  refreshToken: string | null
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  userId: number
  ipAddress: string | null
  userAgent: string | null
  expiresAt: Date | null
  revokedAt: Date | null

  constructor(properties: Partial<JwtToken>) {
    Object.assign(this, properties)
  }
}
