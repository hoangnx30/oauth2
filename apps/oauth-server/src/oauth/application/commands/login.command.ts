import {Command} from '@nestjs/cqrs'

export type LoginCommandResult =
  | {
      accessToken: string
      refreshToken: string
      tokenType: string
      expiresIn: number
    }
  | {
      accessToken: string
      idToken: string
    }
  | {
      oauthRequestId: number
    }

export class LoginCommand extends Command<LoginCommandResult> {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly oauthRequestId?: number,
    public readonly ipAddress?: string,
    public readonly userAgent?: string
  ) {
    super()
  }
}
