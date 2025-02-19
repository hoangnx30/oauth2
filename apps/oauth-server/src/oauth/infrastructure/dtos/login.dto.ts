import {HttpStatus} from '@nestjs/common'
import {ApiHeader, ApiProperty} from '@nestjs/swagger'
import {Exclude, Expose} from 'class-transformer'
import {IsEmail, IsString} from 'class-validator'

import {ErrorMessage} from '@/common/constants/message.constants'
import {ErrorCode} from '@/common/errors'
import {APIDocsBuilder, ErrorOptions} from '@/common/utils/swagger'

import {LoginCommandResult} from '@/oauth/application/commands'

import {RegisterResDto} from './register.dto'

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

  constructor(properties: LoginCommandResult) {
    Object.assign(this, properties)
  }
}

export const LoginDocs = () => {
  const path = '/auth/login'

  const errors: ErrorOptions[] = [
    {
      status: HttpStatus.UNAUTHORIZED,
      key: ErrorMessage.InvalidCredentials,
      value: APIDocsBuilder.createErrorResponse(ErrorCode.InvalidCredentials, path, ErrorMessage.InvalidCredentials)
    }
  ]
  const apiDocsBuilder = new APIDocsBuilder(path)

  return apiDocsBuilder
    .buildApiError(errors)
    .buildApiOperation({summary: 'Login user'})
    .addDecorators(ApiHeader({name: 'user-agent', required: true, description: 'User Agent'}))
    .buildApiOkResponse({model: LoginResDto, statusCode: HttpStatus.CREATED})
    .apply()
}
