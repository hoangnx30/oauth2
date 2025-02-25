import {HttpStatus} from '@nestjs/common'
import {ApiHeader, ApiProperty} from '@nestjs/swagger'
import {Exclude, Expose} from 'class-transformer'
import {IsEmail, IsNumber, IsOptional, IsString} from 'class-validator'

import {ErrorMessage} from '@/common/constants/message.constants'
import {ErrorCode} from '@/common/errors'
import {APIDocsBuilder, ErrorOptions} from '@/common/utils/swagger'

import {LoginCommandResult} from '@/oauth/application/commands'

export class LoginDtoReqBody {
  @ApiProperty({required: false})
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  password: string

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  oauthRequestId: number
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
  updatedAt: Date | null

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
  @ApiProperty({required: false})
  @Expose()
  accessToken: string

  @ApiProperty({type: User, required: false})
  @Expose()
  user: User

  @ApiProperty({required: false})
  @Expose()
  refreshToken: string

  @ApiProperty({required: false})
  @Expose()
  tokenType: string

  @ApiProperty({required: false})
  @Expose()
  expiresIn: number

  @ApiProperty({required: false})
  @Expose()
  oauthRequestId: number

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
