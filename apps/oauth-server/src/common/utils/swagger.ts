import {HttpStatus, applyDecorators} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiOperationOptions,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse
} from '@nestjs/swagger'
import {ApiHeader} from '@nestjs/swagger/dist/decorators/api-header.decorator'

import {ApiOkeResponse, ApiPaginatedResponse} from '../decorators'
import {ErrorCode} from '../errors/error-code'
import {ERROR_MAP} from '../errors/error-map'

export type Decorator = MethodDecorator | ClassDecorator | PropertyDecorator

type ErrorMetadataCategories = 'application/json' | 'multipart/form-data'
type SwaggerErrorContentConfiguration = Partial<
  Record<ErrorMetadataCategories, Record<'examples', Record<string, Record<'value', DefaultExceptionResponse>>>>
>

type SwaggerErrorConfiguration = {
  status: HttpStatus
  description?: string
  content: SwaggerErrorContentConfiguration
}

export class DefaultError {
  @ApiProperty()
  code: string

  @ApiProperty()
  message: string

  @ApiProperty()
  data?: Record<string, unknown>
}

export class DefaultExceptionResponse {
  @ApiProperty({description: 'Current Time', example: new Date().toISOString()})
  timestamp: string

  @ApiProperty({})
  path: string

  @ApiProperty({type: DefaultError})
  error: DefaultError

  @ApiProperty({})
  traceId: string
}

export type ErrorOptions = {
  status: HttpStatus
  mediaType?: ErrorMetadataCategories
  description?: string
  key: string
  value: any
}

export type ApiDocsCreationConfiguration = {
  isUsedAuthGuard?: boolean
  isUsedApiKeyGuard?: boolean
  isUsedRateLimit?: boolean
}

export type HeaderOptions = {
  isUsedApiKeyGuard?: boolean
}

export type GuardOptions = {
  isUsedAuthGuard?: boolean
  isUsedApiKeyGuard?: boolean
  isUsedRateLimit?: boolean
}

export type ResponseConfig = {
  paginated?: boolean
  statusCode?: HttpStatus
  model?: any
  isArray?: boolean
}

export type QueryOptions = {
  paginated?: boolean
}

export type ParamOptions = {
  name?: string
}

export class APIDocsBuilder {
  private readonly decoratos: Decorator[] = []

  constructor(private readonly path: string) {}

  static createErrorResponse(
    code: ErrorCode,
    path?: string,
    msg?: string,
    data?: Record<string, unknown>
  ): DefaultExceptionResponse {
    const message = msg ?? ERROR_MAP[code].message

    const errorData = data ?? {}
    const error: DefaultExceptionResponse = {
      timestamp: new Date().toISOString(),
      path: path ?? 'current path',
      error: {
        code: code,
        message
      },
      traceId: '74bf9a7539-1710582262.954'
    }

    if (data) {
      error.error['data'] = errorData
    }
    return error
  }

  buildApiOperation(options: ApiOperationOptions) {
    return this.addDecorators(ApiOperation(options))
  }

  buildApiError(errors: ErrorOptions[] = [], guardOptions: GuardOptions = {}) {
    const errorOptions = errors.concat(this.createErrors(guardOptions))

    if (guardOptions?.isUsedAuthGuard) {
      this.decoratos.push(ApiBearerAuth())
    }

    return this.addDecorators(...this.convertErrorConfigToSwaggerError(errorOptions).map((i) => ApiResponse(i)))
  }

  buildApiHeader(headerOptions: HeaderOptions) {
    return this
  }

  buildApiQuery(queryOptions: QueryOptions) {
    if (queryOptions.paginated) {
      this.decoratos.push(
        ApiQuery({name: 'limit', description: 'Number of items per page', type: 'string', required: false})
      )
      this.decoratos.push(
        ApiQuery({name: 'skip', description: 'Number of items to skip', type: 'string', required: false})
      )
      this.decoratos.push(
        ApiQuery({
          name: 'sort',
          description: 'Sort fields in ascending or descending order',
          type: 'object',
          required: false
        })
      )
    }

    return this
  }

  buildParam(paramOptions: ParamOptions) {
    if (paramOptions.name) this.decoratos.push(ApiParam({name: paramOptions.name, type: String, required: true}))
    return this
  }

  buildApiOkResponse(responseConfig: ResponseConfig = {}) {
    const {model, statusCode, paginated, isArray} = responseConfig
    if (paginated) {
      this.decoratos.push(ApiPaginatedResponse(model))
    } else {
      this.decoratos.push(ApiOkeResponse({model, status: statusCode, isArray}))
    }

    return this
  }

  buildUploadFile() {
    this.decoratos.push(ApiConsumes('multipart/form-data'))
    this.decoratos.push(
      ApiBody({
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary'
            }
          }
        }
      })
    )

    return this
  }

  addDecorators(...decorators: Decorator[]) {
    this.decoratos.push(...decorators)
    return this
  }

  build() {
    return this.decoratos
  }

  apply() {
    return applyDecorators(...this.build())
  }

  private convertErrorConfigToSwaggerError(errors: ErrorOptions[]) {
    const map: Record<number, SwaggerErrorConfiguration> = {}

    for (const error of errors ?? []) {
      if (!map[error.status]) {
        map[error.status] = {
          status: error.status,
          description: error.description ?? '',
          content: {
            [error.mediaType ?? 'application/json']: {
              examples: {
                [error.key]: {
                  value: error.value
                }
              }
            }
          }
        }
      } else {
        const mediaType: ErrorMetadataCategories = error.mediaType ?? 'application/json'
        if (!map[error.status].content[mediaType]?.examples) {
          map[error.status].content[mediaType] = {
            examples: {
              [error.key]: {value: error.value}
            }
          }
        } else {
          map[error.status].content[mediaType]!.examples[error.key] = {value: error.value}
        }
        map[error.status].description = error.description ?? ''
      }
    }

    return Object.values(map)
  }

  private createErrors(config: GuardOptions) {
    const errors: ErrorOptions[] = []

    errors.push({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      key: 'Unknown',
      value: APIDocsBuilder.createErrorResponse(ErrorCode.Unknown, this.path)
    })

    return errors
  }
}
