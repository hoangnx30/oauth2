import {DrizzlePGModule} from '@knaadh/nestjs-drizzle-pg'
import {Inject, MiddlewareConsumer, Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {CqrsModule} from '@nestjs/cqrs'
import {LoggerModule} from 'nestjs-pino'
import pinoPretty from 'pino-pretty'

import {AppController} from './app.controller'
import {AppService} from './app.service'
import {CustomConfigModule} from './common/config'
import {DATABASE_TOKEN} from './common/constants/app.constants'
import * as schema from './common/entities'
import {Env} from './common/env'
import {ASYNC_LOCAL_STORAGE, AlsModule, AsyncLocalStorageMiddleware, AsyncTracingContext} from './common/middlewares'
import {OAuthModule} from './oauth/oauth.module'

@Module({
  imports: [
    AlsModule,
    CqrsModule.forRoot(),
    CustomConfigModule.register({class: Env}),
    DrizzlePGModule.registerAsync({
      tag: DATABASE_TOKEN,
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get('database.postgres')
        const {user, password, port, database, host} = databaseConfig
        return {
          pg: {config: {user, password, port, database, host}, connection: 'pool'},
          config: {schema: schema, logger: true}
        }
      },
      inject: [ConfigService],
      imports: [CustomConfigModule]
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        stream: pinoPretty(),
        serializers: {
          req(req) {
            req.body = req.raw.body
            return req
          }
        },
        redact: {
          paths: ['req.body.password'],
          censor: () => {
            return '*************'
          }
        }
      }
    }),
    OAuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  constructor(
    @Inject(ASYNC_LOCAL_STORAGE)
    private readonly als: AsyncTracingContext['asyncLocalStorage']
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncLocalStorageMiddleware(this.als)).forRoutes('*')
  }
}
