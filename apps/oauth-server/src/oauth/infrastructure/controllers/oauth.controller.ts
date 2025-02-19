import {Controller, Get, Query, Request, UseGuards} from '@nestjs/common'
import {CommandBus} from '@nestjs/cqrs'
import {Request as ExpressRequest} from 'express'

import {JwtAuthGuard} from '@/common/guards/jwt.guard'

import {AuthorizeCommand} from '@/oauth/application/commands'

import {AuthorizationRequestDto, AuthorizationResDto, AuthorizeDocs} from '../dtos'
import {IOAuthController} from './interface'

@Controller('oauth')
export class OAuthController implements IOAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('authorize')
  @UseGuards(JwtAuthGuard)
  @AuthorizeDocs()
  async authorize(
    @Query() query: AuthorizationRequestDto,
    @Request() request: ExpressRequest
  ): Promise<AuthorizationResDto> {
    const {clientId, codeChallenge, codeChallengeMethod, scope, state, redirectUri} = query

    const command = new AuthorizeCommand(
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
      request!.user!.id,
      state,
      scope
    )

    const {code} = await this.commandBus.execute(command)

    const redirectUrl = new URL(query.redirectUri)
    redirectUrl.searchParams.set('code', code)
    redirectUrl.searchParams.set('state', state)

    return new AuthorizationResDto(redirectUrl.toString())
  }
}
