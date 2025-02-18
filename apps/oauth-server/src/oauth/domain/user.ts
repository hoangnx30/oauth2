type User = {
  id: string
  isActive: boolean | null
  updateAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  username: string
  passwordHash: string
  email: string
}

export class UserDomain {
  id: string
  isActive: boolean
  updateAt: Date | null
  createdAt: Date
  deletedAt: Date | null
  username: string
  passwordHash: string
  email: string

  constructor(properties: User) {
    Object.assign(this, properties)
  }
}
