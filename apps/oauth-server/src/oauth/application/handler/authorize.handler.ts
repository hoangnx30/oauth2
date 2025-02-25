import {Inject} from '@nestjs/common'
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs'
import * as crypto from 'crypto'

import {ErrorCode} from '@/common/errors/error-code'
import {HttpException} from '@/common/errors/http-exception'
import DateTimeUtils from '@/common/utils/datetime'

import {OAuthRequest, OAuthRequestDomain} from '@/oauth/domain/oauth-request'
import {OAUTH_AUTHORIZATION_REQUEST_REPOSITORY_TOKEN, OAUTH_CLIENT_REPOSITORY_TOKEN} from '@/oauth/inject-token'

import {AuthorizeCommand, AuthorizeCommandResult} from '../commands'
import {IOAuthAuthorizationRequestRepository, IOAuthClientRepository} from '../interfaces'

@CommandHandler(AuthorizeCommand)
export class AuthorizeCommandHandler implements ICommandHandler<AuthorizeCommand> {
  constructor(
    @Inject(OAUTH_CLIENT_REPOSITORY_TOKEN)
    private readonly oauthClientRepo: IOAuthClientRepository,
    @Inject(OAUTH_AUTHORIZATION_REQUEST_REPOSITORY_TOKEN)
    private readonly oauthAuthorizationRequestRepository: IOAuthAuthorizationRequestRepository
  ) {}

  async execute(command: AuthorizeCommand): Promise<AuthorizeCommandResult> {
    const {clientId, codeChallenge, codeChallengeMethod, scope, state, redirectUri} = command
    const client = await this.oauthClientRepo.findActiveOAuthClientByClientId(clientId)
    if (!client) {
      throw new HttpException(ErrorCode.InvalidOAuthClient)
    }

    const expiresAt = DateTimeUtils.utc().add(30, 'minute').toDate()

    const oauthRequest = new OAuthRequestDomain({
      clientId: client.id,
      codeChallenge,
      codeChallengeMethod,
      redirectUri,
      scope,
      state,
      status: 'initiated',
      expiresAt
    })

    await this.oauthAuthorizationRequestRepository.save(oauthRequest)

    return {oauthRequestId: oauthRequest.id}
  }

  // private verifyCodeChallenge(codeVerifier: string, codeChallenge: string, method: string): boolean {
  //   if (method === 'S256') {
  //     const hash = crypto
  //       .createHash('sha256')
  //       .update(codeVerifier)
  //       .digest('base64')
  //       .replace(/\+/g, '-')
  //       .replace(/\//g, '_')
  //       .replace(/=/g, '')
  //     return hash === codeChallenge
  //   }
  //   return codeVerifier === codeChallenge // plain method
  // }
}
