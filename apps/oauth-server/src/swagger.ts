import {NestExpressApplication} from '@nestjs/platform-express'
import {DocumentBuilder, SwaggerCustomOptions, SwaggerModule} from '@nestjs/swagger'

const meta = {
  path: 'docs',
  title: 'OAuth Server',
  description: 'API documentation for OAuth Server',
  version: '1.0'
}

export const setupSwagger = (app: NestExpressApplication) => {
  const documentConfigBuilder = new DocumentBuilder()
    .setTitle(meta.title)
    .setDescription(meta.description)
    .setVersion(meta.version)
    .addBearerAuth({type: 'http', scheme: 'bearer', bearerFormat: 'JWT'})

  const documentConfig = documentConfigBuilder.build()

  const document = SwaggerModule.createDocument(app, documentConfig)

  const options: SwaggerCustomOptions = {
    customSiteTitle: meta.title,
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true
    }
  }

  SwaggerModule.setup(meta.path, app, document, options)
}
