import {ApiProperty} from '@nestjs/swagger'
import {Exclude, Expose} from 'class-transformer'
import {IsEmail, IsString} from 'class-validator'

export class LoginDtoReqBody {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  password: string
}

@Exclude()
class User {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  isActive: boolean

  @ApiProperty()
  @Expose()
  updateAt: Date | null

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  deletedAt: Date | null

  @ApiProperty()
  @Expose()
  username: string

  @ApiProperty()
  @Expose()
  email: string
}

@Exclude()
export class LoginResDto {
  @ApiProperty()
  @Expose()
  accessToken: string

  @ApiProperty({type: User})
  @Expose()
  user: User

  @ApiProperty()
  @Expose()
  refreshToken: string

  @ApiProperty()
  @Expose()
  tokenType: string

  @ApiProperty()
  @Expose()
  expiresIn: number

  constructor(properties: any) {
    Object.assign(this, properties)
  }
}
