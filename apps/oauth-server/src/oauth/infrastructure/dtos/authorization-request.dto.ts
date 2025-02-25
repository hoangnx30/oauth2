import {HttpStatus} from '@nestjs/common'
import {ApiHeader, ApiProperty} from '@nestjs/swagger'
import {Exclude, Expose} from 'class-transformer'
import {IsNotEmpty, IsOptional, IsString, IsUrl} from 'class-validator'

import {ErrorMessage} from '@/common/constants/message.constants'
import {ErrorCode} from '@/common/errors'
import {APIDocsBuilder, ErrorOptions} from '@/common/utils/swagger'

import {AuthorizeCommandResult} from '@/oauth/application/commands'

import {LoginResDto} from './login.dto'

@Exclude()
export class AuthorizationRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  clientId: string

  @ApiProperty()
  @Expose()
  @IsUrl()
  @IsNotEmpty()
  @IsString()
  redirectUri: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  codeChallenge: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  codeChallengeMethod: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  state: string

  @ApiProperty({required: false})
  @Expose()
  @IsNotEmpty()
  @IsString()
  scope?: string
}

export const AuthorizeDocs = () => {
  const path = '/oauth/authorize'

  const errors: ErrorOptions[] = [
    {
      status: HttpStatus.BAD_REQUEST,
      key: ErrorMessage.InvalidOAuthClient,
      value: APIDocsBuilder.createErrorResponse(ErrorCode.InvalidOAuthClient, path, ErrorMessage.InvalidOAuthClient)
    }
  ]
  const apiDocsBuilder = new APIDocsBuilder(path)

  return apiDocsBuilder
    .buildApiError(errors)
    .buildApiOperation({summary: 'Authorize user'})
    .buildApiOkResponse({statusCode: HttpStatus.MOVED_PERMANENTLY})
    .apply()
}
