import {Module, Provider} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {JwtModule} from '@nestjs/jwt'

import {CustomConfigModule} from '@/common/config'

import {AuthorizeCommandHandler, LoginCommandHandler} from './application/handler'
import {RegisterCommandHandler} from './application/handler/register.handler'
import {JwtStrategy} from './application/jwt.strategy'
import {AuthService} from './application/services'
import {AuthController, OAuthController} from './infrastructure/controllers'
import {OAuthClientRepository} from './infrastructure/repositories'
import {UserRepository} from './infrastructure/repositories/user.repository'
import {OAUTH_CLIENT_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN} from './inject-token'

const providers: Provider[] = [
  {
    provide: OAUTH_CLIENT_REPOSITORY_TOKEN,
    useClass: OAuthClientRepository
  },
  {
    provide: USER_REPOSITORY_TOKEN,
    useClass: UserRepository
  },
  AuthorizeCommandHandler,
  RegisterCommandHandler,
  LoginCommandHandler,
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
  controllers: [OAuthController, AuthController],
  providers
})
export class OAuthModule {}
