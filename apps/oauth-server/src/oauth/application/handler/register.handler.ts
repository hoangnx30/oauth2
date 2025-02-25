import {Inject} from '@nestjs/common'
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs'
import * as bcrypt from 'bcrypt'

import {ErrorCode} from '@/common/errors/error-code'
import {HttpException} from '@/common/errors/http-exception'

import {UserDomain} from '@/oauth/domain/user'
import {USER_REPOSITORY_TOKEN} from '@/oauth/inject-token'

import {RegisterCommand, RegisterCommandResult} from '../commands/register.command'
import {IUserRepository} from '../interfaces'
import {AuthService} from '../services'

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepo: IUserRepository,
    private readonly authService: AuthService
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterCommandResult> {
    const {username, email, password} = command

    const existingUser = await this.userRepo.findActiveUserByUsernameAndEmail(username, email)

    if (existingUser) {
      throw new HttpException(ErrorCode.UserNameOrEmailExists)
    }

    const hashedPassword = await this.hashPassword(password)

    const userDomain = new UserDomain({username, email, passwordHash: hashedPassword})

    const {passwordHash, ...result} = await this.userRepo.save(userDomain)

    const accessToken = this.authService.createAccessToken(result.id, result.username, result.email)

    return {user: result, accessToken}
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    return passwordHash
  }
}
