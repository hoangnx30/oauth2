import {Command} from '@nestjs/cqrs'

import {UserDomain} from '@/oauth/domain/user'

export type LoginCommandResult = {
  user: Omit<UserDomain, 'passwordHash'>
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export class LoginCommand extends Command<LoginCommandResult> {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {
    super()
  }
}
