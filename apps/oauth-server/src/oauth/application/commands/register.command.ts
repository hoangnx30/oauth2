import {Command} from '@nestjs/cqrs'

import {UserDomain} from '@/oauth/domain/user'

export type RegisterCommandResult = {
  user: Omit<UserDomain, 'passwordHash'>
  accessToken: string
}

export class RegisterCommand extends Command<RegisterCommandResult> {
  constructor(
    public readonly email: string,
    public readonly username: string,
    public readonly password: string
  ) {
    super()
  }
}
