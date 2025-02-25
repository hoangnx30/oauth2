import {Command} from '@nestjs/cqrs'

export type ExchangeCodeForTokenCommandResult =
  | {
      accessToken: string
      tokenType: string
      expiresIn: number
      refreshToken: string
      idToken: string
    }
  | {
      idToken: string
      tokenType: string
    }

export class ExchangeCodeForTokenCommand extends Command<ExchangeCodeForTokenCommandResult> {
  constructor(
    public readonly code: string,
    public readonly codeVerifier: string
  ) {
    super()
  }
}
