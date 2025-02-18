import {Module, Provider} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {JwtModule} from '@nestjs/jwt'

import {CustomConfigModule} from '@/common/config'

import {AuthorizeCommandHandler, LoginCommandHandler} from './application/handler'
import {CreateOAuthClientHandler} from './application/handler/create-oauth-client.handler'
import {RegisterCommandHandler} from './application/handler/register.handler'
import {JwtStrategy} from './application/jwt.strategy'
import {AuthService} from './application/services'
import {AuthController, OAuthClientController, OAuthController} from './infrastructure/controllers'
import {JwtTokenRepository, OAuthClientRepository, UserRepository} from './infrastructure/repositories'
import {JWT_TOKEN_REPOSITORY_TOKEN, OAUTH_CLIENT_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN} from './inject-token'

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
    provide: JWT_TOKEN_REPOSITORY_TOKEN,
    useClass: JwtTokenRepository
  },
  AuthorizeCommandHandler,
  RegisterCommandHandler,
  LoginCommandHandler,
  CreateOAuthClientHandler,
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
