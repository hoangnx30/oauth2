import {ValidationPipe} from '@nestjs/common'
import {HttpAdapterHost, NestFactory} from '@nestjs/core'
import {NestExpressApplication} from '@nestjs/platform-express'
import {Logger} from 'nestjs-pino'

import {AppModule} from './app.module'
import {AllExceptionFilter} from './common/filters'
import {ASYNC_LOCAL_STORAGE} from './common/middlewares'
import {setupSwagger} from './swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const logger = app.get(Logger)

  app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost), logger, app.get(ASYNC_LOCAL_STORAGE)))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        exposeUnsetFields: false
      }
    })
  )

  setupSwagger(app)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
