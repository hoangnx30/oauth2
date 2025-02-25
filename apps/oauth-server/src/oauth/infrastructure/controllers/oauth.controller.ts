import {Body, Controller, Get, Post, Query, Res} from '@nestjs/common'
import {CommandBus} from '@nestjs/cqrs'
import {Response} from 'express'

import {AuthorizeCommand, ExchangeCodeForTokenCommand, UserConsentApprovalCommand} from '@/oauth/application/commands'

import {
  AuthorizationRequestDto,
  AuthorizeDocs,
  UserConsentApprovalDocs,
  UserConsentApprovalReqBodyDto,
  UserConsentApprovalResDto
} from '../dtos'
import {ExchangeTokenDocs, ExchangeTokenReqBodyDto, ExchangeTokenResDto} from '../dtos/exchange-token.dto'
import {IOAuthController} from './interface'

@Controller('oauth')
export class OAuthController implements IOAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('authorize')
  @AuthorizeDocs()
  async authorize(@Query() query: AuthorizationRequestDto, @Res() response: Response): Promise<void> {
    const {clientId, codeChallenge, codeChallengeMethod, scope, state, redirectUri} = query

    const command = new AuthorizeCommand(clientId, redirectUri, codeChallenge, codeChallengeMethod, state, scope)

    try {
      const {oauthRequestId} = await this.commandBus.execute(command)
      console.log('oauthRequestId', oauthRequestId)

      response.redirect(`/login?oauth-request-id=${oauthRequestId}`)
    } catch (error) {
      console.log(error)
      response.redirect(`${redirectUri}?error=server_error&state=${state}`)
    }
  }

  @Post('consent/approval')
  @UserConsentApprovalDocs()
  async token(@Body() body: UserConsentApprovalReqBodyDto): Promise<UserConsentApprovalResDto> {
    const command = new UserConsentApprovalCommand(body.oauthRequestId)
    const {redirectUrl} = await this.commandBus.execute(command)

    return new UserConsentApprovalResDto(redirectUrl)
  }

  @Post('token')
  @ExchangeTokenDocs()
  async exchangeCodeForToken(@Body() body: ExchangeTokenReqBodyDto): Promise<ExchangeTokenResDto> {
    const command = new ExchangeCodeForTokenCommand(body.code, body.codeVerifier)

    const res = await this.commandBus.execute(command)

    return new ExchangeTokenResDto(res)
  }
}
