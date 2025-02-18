import {ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common'
import {HttpAdapterHost} from '@nestjs/core'
import {AsyncLocalStorage} from 'async_hooks'
import {plainToInstance} from 'class-transformer'
import {Logger} from 'nestjs-pino'

import {ErrorCode} from '../errors/error-code'
import {HttpException as CustomHttpException} from '../errors/http-exception'
import {AsyncStore, generateRandomTraceId} from '../middlewares'
import {remapErrorFields} from './utils'

enum EXCEPTION_TYPE {
  HTTP,
  CUSTOM_HTTP
}

export type ResponseAndStatusType = {
  statusCode: HttpStatus
  error: Record<string, unknown>
  responseCode: number
  errorToJson?: Record<string, unknown>
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
    private readonly asyncLocalStorage: AsyncLocalStorage<AsyncStore>
  ) {}
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception)
    if (this.isExceptionFromHttp(exception)) {
      return this.sendErrorResponseFromHttpException(exception, host)
    }

    return this.sendErrorResponseFromCustomHttpException(exception, host)
  }

  isExceptionFromHttp(exception: Record<string, unknown>): boolean {
    return exception instanceof HttpException
  }

  sendErrorResponseFromHttpException(exception: Error | Record<string, unknown>, host: ArgumentsHost): void {
    const request: Request = host.switchToHttp().getRequest()
    const response: Response = host.switchToHttp().getResponse()
    const timestamp = new Date().toISOString()
    const path = this.httpAdapterHost.httpAdapter.getRequestUrl(request) as string
    console.log(exception)
    this.logger.error({
      traceId: this.getTraceId(),
      error: {
        kind: exception.name,
        message: exception.message,
        stack: exception.stack
      }
    })

    const {error, statusCode, responseCode} = this.constructErrorResponse(
      exception as unknown as Record<string, unknown>,
      EXCEPTION_TYPE.HTTP
    )
    this.httpAdapterHost.httpAdapter.reply(
      response,
      {
        timestamp,
        path,
        responseCode,
        error,
        traceId: this.getTraceId()
      },
      statusCode
    )
  }

  sendErrorResponseFromCustomHttpException(exception: Error | Record<string, unknown>, host: ArgumentsHost): void {
    const request: Request = host.switchToHttp().getRequest()
    const response: Response = host.switchToHttp().getResponse()
    const timestamp = new Date().toISOString()
    const path = this.httpAdapterHost.httpAdapter.getRequestUrl(request) as string

    const {error, statusCode, errorToJson, responseCode} = this.constructErrorResponse(
      exception as unknown as Record<string, unknown>,
      EXCEPTION_TYPE.CUSTOM_HTTP
    )
    this.logger.error({
      error: errorToJson,
      traceId: this.getTraceId()
    })
    this.httpAdapterHost.httpAdapter.reply(
      response,
      {
        timestamp,
        path,
        responseCode,
        error: error,
        traceId: this.getTraceId()
      },
      statusCode
    )
  }

  constructErrorResponse(exception: Record<string, unknown>, type: EXCEPTION_TYPE): ResponseAndStatusType {
    switch (type) {
      case EXCEPTION_TYPE.HTTP:
        return {
          statusCode: (exception as unknown as HttpException).getStatus(),
          responseCode: 1,
          error: {
            code: exception.name,
            message: exception.message,
            data:
              exception instanceof BadRequestException
                ? {
                    fields: remapErrorFields((exception.getResponse() as Record<string, unknown>)?.['message'])
                  }
                : undefined
          }
        }

      case EXCEPTION_TYPE.CUSTOM_HTTP:
      default: {
        let resolvedException: CustomHttpException
        if (exception instanceof CustomHttpException) {
          resolvedException = exception
        } else if (exception.code) {
          resolvedException = plainToInstance(CustomHttpException, exception)
        } else {
          resolvedException = new CustomHttpException(ErrorCode.Unknown, {
            origin: exception as unknown as Error
          })
        }

        return {
          statusCode: resolvedException.statusCode,
          responseCode: exception.responseCode as number,
          error: {
            code: resolvedException.name,
            message: resolvedException.message,
            data: resolvedException.meta?.data ? resolvedException.meta.data : undefined
          },
          errorToJson: resolvedException.toJson()
        }
      }
    }
  }

  getTraceId(): string {
    return this.asyncLocalStorage.getStore()?.traceId ?? ''
  }
}
