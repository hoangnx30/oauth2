import {Inject} from '@nestjs/common'
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs'
import * as bcrypt from 'bcrypt'

import {ErrorCode, HttpException} from '@/common/errors'
import DateTimeUtils from '@/common/utils/datetime'

import {JWT_TOKEN_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN} from '@/oauth/inject-token'

import {LoginCommand, LoginCommandResult} from '../commands/login.command'
import {IJwtTokenRepository, IUserRepository} from '../interfaces'
import {AuthService} from '../services'

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepo: IUserRepository,
    @Inject(JWT_TOKEN_REPOSITORY_TOKEN) private readonly jwtTokenRepo: IJwtTokenRepository,
    private readonly authService: AuthService
  ) {}

  async execute(command: LoginCommand): Promise<LoginCommandResult> {
    const {email, password, ipAddress, userAgent} = command

    const exsistingUser = await this.userRepo.findActiveUserByEmail(email)

    if (!exsistingUser) {
      throw new HttpException(ErrorCode.InvalidCredentials)
    }
    const {passwordHash, ...result} = exsistingUser
    await this.verifyPassword(password, exsistingUser.passwordHash)

    const accessToken = this.authService.createAccessToken(result.id, result.username)
    const refreshToken = this.authService.createRefreshToken(result.id, result.username)

    await this.jwtTokenRepo.save({
      userId: exsistingUser.id,
      refreshToken,
      expiresAt: DateTimeUtils.utc().add(30, 'day').toDate(),
      ipAddress,
      userAgent
    })

    return {user: result, accessToken, refreshToken, tokenType: 'Bearer', expiresIn: 3600}
  }

  private async verifyPassword(password: string, passwordHash: string): Promise<void> {
    const isPasswordValid = await bcrypt.compare(password, passwordHash)
    if (!isPasswordValid) {
      throw new HttpException(ErrorCode.InvalidCredentials)
    }
  }
}
