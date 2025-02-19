import {Command} from '@nestjs/cqrs'

export type AuthorizeCommandResult = {
  code: string
  state: string
}

export class AuthorizeCommand extends Command<AuthorizeCommandResult> {
  constructor(
    public readonly clientId: string,
    public readonly redirectUri: string,
    public readonly codeChallenge: string,
    public readonly codeChallengeMethod: string,
    public readonly userId: string,
    public readonly state: string,
    public readonly scope?: string
  ) {
    super()
  }
}
