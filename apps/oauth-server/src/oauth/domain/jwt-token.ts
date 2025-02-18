type JwtToken = {
  id: number
  refreshToken: string | null
  updateAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  userId: string
  ipAddress: string | null
  userAgent: string | null
  expiresAt: Date | null
  revokedAt: Date | null
}

export class JwtTokenDomain {
  id: number
  refreshToken: string | null
  updateAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  userId: string
  ipAddress: string | null
  userAgent: string | null
  expiresAt: Date | null
  revokedAt: Date | null

  constructor(properties: JwtToken) {
    Object.assign(this, properties)
  }
}
