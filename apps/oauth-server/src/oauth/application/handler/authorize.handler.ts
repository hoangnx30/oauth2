import {Inject, UnauthorizedException} from '@nestjs/common'
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs'
import * as crypto from 'crypto'

import {ErrorCode} from '@/common/errors/error-code'
import {HttpException} from '@/common/errors/http-exception'
import DateTimeUtils from '@/common/utils/datetime'

import {OAuthAuthorizationRequestDomain} from '@/oauth/domain/oauth-authorization-request'
import {OAUTH_CLIENT_REPOSITORY_TOKEN} from '@/oauth/inject-token'

import {AuthorizeCommand, AuthorizeCommandResult} from '../commands'
import {IOAuthClientRepository} from '../interfaces'

@CommandHandler(AuthorizeCommand)
export class AuthorizeCommandHandler implements ICommandHandler<AuthorizeCommand> {
  constructor(@Inject(OAUTH_CLIENT_REPOSITORY_TOKEN) private readonly oauthClientRepo: IOAuthClientRepository) {}

  async execute(command: AuthorizeCommand): Promise<AuthorizeCommandResult> {
    const {clientId} = command
    const client = await this.oauthClientRepo.findActiveOAuthClientByClientId(clientId)
    if (!client) {
      throw new HttpException(ErrorCode.InvalidOAuthClient)
    }

    const code = this.generateCode()
    const expireAt = DateTimeUtils.utc().add(30, 'minute')

    return {code: ''}
  }

  private generateCode(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  private verifyCodeChallenge(codeVerifier: string, codeChallenge: string, method: string): boolean {
    if (method === 'S256') {
      const hash = crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
      return hash === codeChallenge
    }
    return codeVerifier === codeChallenge // plain method
  }
}
