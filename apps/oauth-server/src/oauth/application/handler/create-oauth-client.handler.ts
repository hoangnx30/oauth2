import {Inject} from '@nestjs/common'
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs'
import * as crypto from 'crypto'

import {OAuthClientDomain} from '@/oauth/domain/oauth-client'
import {OAUTH_CLIENT_REPOSITORY_TOKEN} from '@/oauth/inject-token'

import {CreateOAuthClientCommand, CreateOAuthClientCommandResult} from '../commands'
import {IOAuthClientRepository} from '../interfaces'

@CommandHandler(CreateOAuthClientCommand)
export class CreateOAuthClientHandler implements ICommandHandler<CreateOAuthClientCommand> {
  constructor(@Inject(OAUTH_CLIENT_REPOSITORY_TOKEN) private readonly oauthClientRepo: IOAuthClientRepository) {}

  async execute(command: CreateOAuthClientCommand): Promise<CreateOAuthClientCommandResult> {
    const {clientName, clientUri, isConfidential, scope, redirectUris, userId} = command

    const oauthClientDomain = new OAuthClientDomain({
      clientName,
      clientUri,
      redirectUri: redirectUris.join(','),
      scope: scope ?? null,
      isConfidential: isConfidential ?? false,
      createdBy: userId
    })

    oauthClientDomain.generateClientId()
    oauthClientDomain.generateClientSecret()

    const oauthClient = await this.oauthClientRepo.save(oauthClientDomain)

    return oauthClient
  }

  generateClientId(): string {
    // Generate a URL-safe, base64 encoded string
    return crypto.randomBytes(32).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  generateClientSecret(): string {
    // Generate a secure random string for client secret
    return crypto.randomBytes(48).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }
}
