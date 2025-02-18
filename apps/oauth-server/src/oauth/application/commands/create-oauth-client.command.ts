import {Command} from '@nestjs/cqrs'

export type CreateOAuthClientCommandResult = {
  id: string
  clientId: string
  clientName: string
  clientUri: string | null
  redirectUri: string
  scope: string | null
  isConfidential: boolean
  clientSecret: string | null
}

export class CreateOAuthClientCommand extends Command<CreateOAuthClientCommandResult> {
  constructor(
    public readonly clientName: string,
    public readonly clientUri: string,
    public readonly redirectUris: string[],
    public readonly userId: string,
    public readonly scope?: string,
    public readonly isConfidential?: boolean
  ) {
    super()
  }
}
