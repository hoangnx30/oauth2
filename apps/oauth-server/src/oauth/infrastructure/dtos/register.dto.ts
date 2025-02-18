import {HttpStatus} from '@nestjs/common'
import {ApiProperty} from '@nestjs/swagger'
import {IsEmail, IsString, Matches, MinLength} from 'class-validator'

import {ErrorMessage} from '@/common/constants/message.constants'
import {ErrorCode} from '@/common/errors/error-code'
import {APIDocsBuilder, ErrorOptions} from '@/common/utils/swagger'

export class RegisterDtoReqBody {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  username: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Password must be at least 8 characters long and contain at least one number and one special character'
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {message: 'Password too weak'})
  password: string
}

class User {
  @ApiProperty() id: string
  @ApiProperty() isActive: boolean
  @ApiProperty() updateAt: Date | null
  @ApiProperty() createdAt: Date
  @ApiProperty() deletedAt: Date | null
  @ApiProperty() username: string
  @ApiProperty() email: string
}

export class RegisterResDto {
  @ApiProperty({type: User})
  user: User

  @ApiProperty()
  accessToken: string
}

export const RegisterDocs = () => {
  const path = '/auth/register'

  const errors: ErrorOptions[] = [
    {
      status: HttpStatus.CONFLICT,
      key: ErrorMessage.UserNameOrEmailExists,
      value: APIDocsBuilder.createErrorResponse(
        ErrorCode.UserNameOrEmailExists,
        path,
        ErrorMessage.UserNameOrEmailExists
      )
    }
  ]
  const apiDocsBuilder = new APIDocsBuilder(path)

  return apiDocsBuilder
    .buildApiError(errors)
    .buildApiOperation({summary: 'Register a new user'})
    .buildApiOkResponse({model: RegisterResDto, statusCode: HttpStatus.CREATED})
    .apply()
}
