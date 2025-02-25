import {Inject} from '@nestjs/common'
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs'
import {JwtService} from '@nestjs/jwt'

import {UnitOfWorkService} from '@/common/drizzle'
import {ErrorCode, HttpException} from '@/common/errors'
import DateTimeUtils from '@/common/utils/datetime'

import {OAuthAccessTokenDomain} from '@/oauth/domain/oauth-access-token'
import {OAuthRefreshTokenDomain} from '@/oauth/domain/oauth-refresh-token'
import {
  OAUTH_ACCESS_TOKEN_REPOSITORY_TOKEN,
  OAUTH_CODE_REPOSITORY_TOKEN,
  OAUTH_REFRESH_TOKEN_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN
} from '@/oauth/inject-token'

import {ExchangeCodeForTokenCommand, ExchangeCodeForTokenCommandResult} from '../commands'
import {
  IOAuthAccessTokenRepository,
  IOAuthCodeRepository,
  IOAuthRefreshTokenRepository,
  IUserRepository
} from '../interfaces'

@CommandHandler(ExchangeCodeForTokenCommand)
export class ExchangeCodeForTokenCommandHandler implements ICommandHandler<ExchangeCodeForTokenCommand> {
  constructor(
    @Inject(OAUTH_CODE_REPOSITORY_TOKEN)
    private readonly oauthCodeRepo: IOAuthCodeRepository,
    @Inject(OAUTH_ACCESS_TOKEN_REPOSITORY_TOKEN)
    private readonly oauthAccessTokenRepo: IOAuthAccessTokenRepository,
    @Inject(OAUTH_REFRESH_TOKEN_REPOSITORY_TOKEN)
    private readonly oauthRefreshTokenRepo: IOAuthRefreshTokenRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepo: IUserRepository,
    private readonly jwtTokenService: JwtService,
    private readonly unitOfWorkService: UnitOfWorkService
  ) {}

  async execute(command: ExchangeCodeForTokenCommand): Promise<ExchangeCodeForTokenCommandResult> {
    const {code, codeVerifier} = command
    const oauthCodeDomain = await this.oauthCodeRepo.findUnUsedCodeByCode(code)

    console.log(oauthCodeDomain)

    if (!oauthCodeDomain || DateTimeUtils.utc(oauthCodeDomain.expiresAt).isAfter(DateTimeUtils.utc().toDate())) {
      throw new HttpException(ErrorCode.InvalidOrExpiredCode)
    }

    oauthCodeDomain.oauthRequest?.verifyCodeChallenge(codeVerifier)

    const oauthAccessToken = new OAuthAccessTokenDomain({
      userId: oauthCodeDomain.oauthRequest!.userId,
      scope: oauthCodeDomain.oauthRequest!.scope,
      clientId: oauthCodeDomain.oauthRequest!.clientId
    })
    oauthAccessToken.generateAccessToken()
    oauthAccessToken.initExpiresAt()

    const oauthRefreshToken = new OAuthRefreshTokenDomain({
      userId: oauthCodeDomain.oauthRequest!.userId!,
      clientId: oauthCodeDomain.oauthRequest!.clientId
    })
    oauthRefreshToken.generateRefreshToken()
    oauthRefreshToken.initExpiresAt()

    const user = await this.userRepo.findActiveUserById(oauthCodeDomain.oauthRequest!.userId!)

    const idToken = this.jwtTokenService.sign(
      {id: user!.id, email: user!.email, username: user!.username},
      {expiresIn: '1h'}
    )

    await this.unitOfWorkService.execute(async () => {
      oauthCodeDomain.isUsed = true
      await this.oauthCodeRepo.save(oauthCodeDomain)
      const accessToken = await this.oauthAccessTokenRepo.save(oauthAccessToken)

      oauthRefreshToken.accessTokenId = accessToken.id
      await this.oauthRefreshTokenRepo.save(oauthRefreshToken)
    })

    return {
      accessToken: oauthAccessToken.accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      refreshToken: oauthRefreshToken.refreshToken,
      idToken
    }
  }
}
