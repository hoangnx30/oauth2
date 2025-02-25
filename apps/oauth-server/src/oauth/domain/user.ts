type User = {
  id: number
  isActive: boolean | null
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  username: string
  passwordHash: string
  email: string
}

export class UserDomain {
  id: number
  isActive: boolean
  updatedAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  username: string
  passwordHash: string
  email: string

  constructor(properties: Partial<User>) {
    Object.assign(this, properties)
  }
}
