import {Inject} from '@nestjs/common'
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs'
import * as bcrypt from 'bcrypt'

import {ErrorCode, HttpException} from '@/common/errors'
import DateTimeUtils from '@/common/utils/datetime'

import {JwtTokenDomain} from '@/oauth/domain/jwt-token'
import {
  JWT_TOKEN_REPOSITORY_TOKEN,
  OAUTH_AUTHORIZATION_REQUEST_REPOSITORY_TOKEN,
  OAUTH_CLIENT_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN
} from '@/oauth/inject-token'

import {LoginCommand, LoginCommandResult} from '../commands/login.command'
import {
  IJwtTokenRepository,
  IOAuthAuthorizationRequestRepository,
  IOAuthClientRepository,
  IUserRepository
} from '../interfaces'
import {AuthService} from '../services'

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepo: IUserRepository,
    @Inject(JWT_TOKEN_REPOSITORY_TOKEN) private readonly jwtTokenRepo: IJwtTokenRepository,
    @Inject(OAUTH_AUTHORIZATION_REQUEST_REPOSITORY_TOKEN)
    private readonly oauthAuthorizationRequestRepo: IOAuthAuthorizationRequestRepository,
    private readonly authService: AuthService
  ) {}

  async execute(command: LoginCommand): Promise<LoginCommandResult> {
    const {email, password, ipAddress, userAgent, oauthRequestId} = command
    console.log(command)

    const exsistingUser = await this.userRepo.findActiveUserByEmail(email)

    if (!exsistingUser) {
      throw new HttpException(ErrorCode.InvalidCredentials)
    }

    const {passwordHash, ...result} = exsistingUser
    await this.verifyPassword(password, exsistingUser.passwordHash)

    if (oauthRequestId) {
      return this.handleOAuthRequestLogin(oauthRequestId, exsistingUser.id)
    }

    const accessToken = this.authService.createAccessToken(result.id, result.username, result.email)
    const refreshToken = this.authService.createRefreshToken(result.id, result.username, result.email)

    const jwtTokenDomain = new JwtTokenDomain({
      userId: exsistingUser.id,
      refreshToken,
      expiresAt: DateTimeUtils.utc().add(30, 'day').toDate(),
      ipAddress,
      userAgent
    })

    await this.jwtTokenRepo.save(jwtTokenDomain)

    return {accessToken, refreshToken, tokenType: 'Bearer', expiresIn: 3600}
  }

  private async verifyPassword(password: string, passwordHash: string): Promise<void> {
    const isPasswordValid = await bcrypt.compare(password, passwordHash)
    if (!isPasswordValid) {
      throw new HttpException(ErrorCode.InvalidCredentials)
    }
  }

  private async handleOAuthRequestLogin(oauthRequestId: number, userId: number) {
    const oauthRequest = await this.oauthAuthorizationRequestRepo.findById(oauthRequestId)
    if (!oauthRequest) {
      throw new HttpException(ErrorCode.InvalidOAuthClient)
    }

    oauthRequest.status = 'authenticated'
    oauthRequest.userId = userId

    console.log(oauthRequest)

    await this.oauthAuthorizationRequestRepo.save(oauthRequest)

    return {oauthRequestId: oauthRequest.id}
  }
}
