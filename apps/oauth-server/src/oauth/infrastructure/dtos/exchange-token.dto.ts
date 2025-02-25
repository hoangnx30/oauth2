import {HttpStatus} from '@nestjs/common'
import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty, IsString} from 'class-validator'

import {APIDocsBuilder} from '@/common/utils/swagger'

export class ExchangeTokenReqBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codeVerifier: string
}

export class ExchangeTokenResDto {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  tokenType: string

  @ApiProperty()
  expiresIn: number

  @ApiProperty()
  refreshToken: string

  @ApiProperty()
  idToken: string

  constructor(data: Partial<ExchangeTokenResDto>) {
    Object.assign(this, data)
  }
}

export function ExchangeTokenDocs() {
  const path = '/oauth/token'

  const apiDocsBuilder = new APIDocsBuilder(path)

  return apiDocsBuilder
    .buildApiOperation({summary: 'Exchange code for token'})
    .buildApiError()
    .buildApiOkResponse({model: ExchangeTokenResDto, statusCode: HttpStatus.OK})
    .apply()
}
