import {Command} from '@nestjs/cqrs'

export type CreateOAuthClientCommandResult = {
  id: string
  clientId: string
  clientName: string
  clientUri: string
  redirectUris: string[]
  scope?: string
  isConfidential: boolean
}

export class CreateOAuthClientCommand extends Command<CreateOAuthClientCommandResult> {
  constructor(
    public readonly clientName: string,
    public readonly clientUri: string,
    public readonly redirectUris: string[],
    public readonly scope?: string,
    public readonly isConfidential?: string
  ) {
    super()
  }
}
