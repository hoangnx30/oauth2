import {Controller, Get, Query} from '@nestjs/common'
import {CommandBus} from '@nestjs/cqrs'

import {AuthorizeCommand} from '@/oauth/application/commands'

import {AuthorizationRequestDto, AuthorizationResDto} from '../dtos'
import {IOAuthController} from './interface'

@Controller('oauth')
export class OAuthController implements IOAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('authorize')
  async authorize(@Query() query: AuthorizationRequestDto): Promise<AuthorizationResDto> {
    const {clientId, codeChallenge, codeChallengeMethod, scope, state, redirectUri} = query

    const command = new AuthorizeCommand(clientId, redirectUri, codeChallenge, codeChallengeMethod, state, scope)

    const {code} = await this.commandBus.execute(command)

    const redirectUrl = new URL(query.redirectUri)
    redirectUrl.searchParams.set('code', code)

    if (state) {
      redirectUrl.searchParams.set('state', state)
    }

    return {redirectUrl: redirectUrl.toString()}
  }
}
