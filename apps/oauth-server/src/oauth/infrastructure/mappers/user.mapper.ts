import {InsertUser, SelectUser} from '@/common/entities'

import {UserDomain} from '@/oauth/domain/user'

export class UserMapper {
  public static toDomain(oauthUserEntity: SelectUser): UserDomain {
    return new UserDomain({
      id: oauthUserEntity.id,
      username: oauthUserEntity.username,
      email: oauthUserEntity.email,
      passwordHash: oauthUserEntity.passwordHash,
      createdAt: oauthUserEntity.createdAt,
      updatedAt: oauthUserEntity.updatedAt,
      deletedAt: oauthUserEntity.deletedAt
    })
  }

  public static toEntity(userDomain: UserDomain): InsertUser {
    return {
      username: userDomain.username,
      email: userDomain.email,
      passwordHash: userDomain.passwordHash
    }
  }
}
