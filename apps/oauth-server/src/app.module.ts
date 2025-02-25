import {Inject, MiddlewareConsumer, Module} from '@nestjs/common'
import {CqrsModule} from '@nestjs/cqrs'
import {LoggerModule} from 'nestjs-pino'
import pinoPretty from 'pino-pretty'

import {AppController} from './app.controller'
import {AppService} from './app.service'
import {CustomConfigModule} from './common/config'
import {DatabaseModule} from './common/drizzle'
import {Env} from './common/env'
import {ASYNC_LOCAL_STORAGE, AlsModule, AsyncLocalStorageMiddleware, AsyncTracingContext} from './common/middlewares'
import {OAuthModule} from './oauth/oauth.module'

@Module({
  imports: [
    AlsModule,
    CqrsModule.forRoot(),
    CustomConfigModule.register({class: Env}),
    DatabaseModule,
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
