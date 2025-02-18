import {HttpStatus} from '@nestjs/common'
import {merge} from 'lodash'

import {ErrorCode} from './error-code'
import {ERROR_MAP} from './error-map'

interface HttpExceptionProps {
  message: string
  meta: Record<string, unknown>
  statusCode?: HttpStatus
  origin?: Error
}

export class HttpException extends Error {
  readonly errorCode: ErrorCode
  message: string
  statusCode: HttpStatus
  origin: HttpExceptionProps['origin']
  meta: HttpExceptionProps['meta']
  timestamp?: string
  path?: string

  constructor(errorCode: ErrorCode, props: Partial<HttpException> = {}) {
    super()
    this.errorCode = errorCode

    const defaults = this.getDefaultErrorConfiuration()
    const {statusCode, message, meta} = merge(defaults, props) as typeof defaults
    this.captureStackTrace()

    this.statusCode = statusCode
    this.message = message
    this.origin = props.origin
    this.meta = meta ?? {}
  }

  private getDefaultErrorConfiuration() {
    const name = ErrorCode[this.errorCode]
    return {
      name,
      responseCode: 1,
      ...ERROR_MAP[name as keyof typeof ERROR_MAP]
    }
  }

  public toJson() {
    const json: Record<string, unknown> = {
      kind: this.name,
      message: this.message,
      stack: this.stack,

      statusCode: this.statusCode,
      meta: this.meta,
      origin: this.origin,

      timestamp: this.timestamp,
      path: this.path
    }
    return json
  }

  private captureStackTrace() {
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error(this.message).stack
    }
  }
}
