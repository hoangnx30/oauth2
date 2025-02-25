import {Module, Provider} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {JwtModule} from '@nestjs/jwt'

import {CustomConfigModule} from '@/common/config'

import {
  AuthorizeCommandHandler,
  CreateOAuthClientHandler,
  ExchangeCodeForTokenCommandHandler,
  LoginCommandHandler,
  RegisterCommandHandler,
  UserConsentHandler
} from './application/handler'
import {JwtStrategy} from './application/jwt.strategy'
import {AuthService} from './application/services'
import {AuthController, OAuthClientController, OAuthController} from './infrastructure/controllers'
import {
  JwtTokenRepository,
  OAuthAccessTokenRepository,
  OAuthAuthorizationCodeRepository,
  OAuthClientRepository,
  OAuthRefreshTokenRepository,
  OAuthRequestRepository,
  UserRepository
} from './infrastructure/repositories'
import {OAuthAuthorizationApprovalRepository} from './infrastructure/repositories/oauth-authorization-approval.repository'
import {
  JWT_TOKEN_REPOSITORY_TOKEN,
  OAUTH_ACCESS_TOKEN_REPOSITORY_TOKEN,
  OAUTH_AUTHORIZATION_APPROVAL_REPOSITORY_TOKEN,
  OAUTH_AUTHORIZATION_REQUEST_REPOSITORY_TOKEN,
  OAUTH_CLIENT_REPOSITORY_TOKEN,
  OAUTH_CODE_REPOSITORY_TOKEN,
  OAUTH_REFRESH_TOKEN_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN
} from './inject-token'

const providers: Provider[] = [
  {
    provide: OAUTH_CLIENT_REPOSITORY_TOKEN,
    useClass: OAuthClientRepository
  },
  {
    provide: USER_REPOSITORY_TOKEN,
    useClass: UserRepository
  },
  {
    provide: OAUTH_AUTHORIZATION_REQUEST_REPOSITORY_TOKEN,
    useClass: OAuthRequestRepository
  },
  {
    provide: JWT_TOKEN_REPOSITORY_TOKEN,
    useClass: JwtTokenRepository
  },
  {
    provide: OAUTH_ACCESS_TOKEN_REPOSITORY_TOKEN,
    useClass: OAuthAccessTokenRepository
  },
  {
    provide: OAUTH_REFRESH_TOKEN_REPOSITORY_TOKEN,
    useClass: OAuthRefreshTokenRepository
  },
  {
    provide: OAUTH_CODE_REPOSITORY_TOKEN,
    useClass: OAuthAuthorizationCodeRepository
  },
  {
    provide: OAUTH_AUTHORIZATION_APPROVAL_REPOSITORY_TOKEN,
    useClass: OAuthAuthorizationApprovalRepository
  },
  AuthorizeCommandHandler,
  RegisterCommandHandler,
  LoginCommandHandler,
  CreateOAuthClientHandler,
  UserConsentHandler,
  ExchangeCodeForTokenCommandHandler,
  JwtStrategy,
  AuthService
]

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [CustomConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiration'),
          issuer: 'oauth2-server'
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [OAuthController, AuthController, OAuthClientController],
  providers
})
export class OAuthModule {}
