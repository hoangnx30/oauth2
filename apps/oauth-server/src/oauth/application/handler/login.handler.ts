import {Inject} from '@nestjs/common'
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs'
import * as bcrypt from 'bcrypt'

import {ErrorCode, HttpException} from '@/common/errors'

import {USER_REPOSITORY_TOKEN} from '@/oauth/inject-token'

import {LoginCommand, LoginCommandResult} from '../commands/login.command'
import {IUserRepository} from '../interfaces'
import {AuthService} from '../services'

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepo: IUserRepository,
    private readonly authService: AuthService
  ) {}

  async execute(command: LoginCommand): Promise<LoginCommandResult> {
    const {email, password} = command

    const exsistingUser = await this.userRepo.findActiveUserByEmail(email)

    if (!exsistingUser) {
      throw new HttpException(ErrorCode.InvalidCredentials)
    }
    const {passwordHash, ...result} = exsistingUser
    await this.verifyPassword(password, exsistingUser.passwordHash)

    const accessToken = this.authService.createAccessToken(result.id, result.username)
    const refreshToken = this.authService.createRefreshToken(result.id, result.username)

    return {user: result, accessToken, refreshToken, tokenType: 'Bearer', expiresIn: 3600}
  }

  private async verifyPassword(password: string, passwordHash: string): Promise<void> {
    const isPasswordValid = await bcrypt.compare(password, passwordHash)
    if (!isPasswordValid) {
      throw new HttpException(ErrorCode.InvalidCredentials)
    }
  }
}
