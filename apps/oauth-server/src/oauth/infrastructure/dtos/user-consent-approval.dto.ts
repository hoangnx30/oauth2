import {HttpStatus} from '@nestjs/common'
import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty, IsNumber, IsString} from 'class-validator'

import {ErrorMessage} from '@/common/constants/message.constants'
import {ErrorCode} from '@/common/errors'
import {APIDocsBuilder, ErrorOptions} from '@/common/utils/swagger'

export class UserConsentApprovalReqBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  oauthRequestId: number
}

export class UserConsentApprovalResDto {
  @ApiProperty()
  redirectUrl: string

  constructor(redirectUrl: string) {
    this.redirectUrl = redirectUrl
  }
}

export function UserConsentApprovalDocs() {
  const path = '/oauth/consent/approval'

  const errors: ErrorOptions[] = [
    {
      status: HttpStatus.BAD_REQUEST,
      key: ErrorMessage.OAuthRequestExpired,
      value: APIDocsBuilder.createErrorResponse(ErrorCode.OAuthRequestExpired, path, ErrorMessage.OAuthRequestExpired)
    },
    {
      status: HttpStatus.BAD_REQUEST,
      key: ErrorMessage.InvalidOAuthRequest,
      value: APIDocsBuilder.createErrorResponse(ErrorCode.InvalidOAuthRequest, path, ErrorMessage.InvalidOAuthRequest)
    }
  ]
  const apiDocsBuilder = new APIDocsBuilder(path)

  return apiDocsBuilder
    .buildApiError(errors)
    .buildApiOperation({summary: 'User approves the consent request'})
    .buildApiOkResponse({model: UserConsentApprovalResDto, statusCode: HttpStatus.OK})
    .apply()
}
