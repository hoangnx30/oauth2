import {HttpStatus} from '@nestjs/common'

import {ErrorMessage} from '../constants/message.constants'
import {ErrorCode} from './error-code'

interface ErrorConfig {
  statusCode: HttpStatus
  message: string
  meta?: Record<string, unknown>
}

type ErrorMap = {
  [Code in ErrorCode]: ErrorConfig
}

export const ERROR_MAP: ErrorMap = {
  [ErrorCode.Unknown]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: ErrorMessage.InternalServerError
  },
  [ErrorCode.InvalidOAuthClient]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: ErrorMessage.InvalidOAuthClient
  },
  [ErrorCode.UserNameOrEmailExists]: {
    statusCode: HttpStatus.CONFLICT,
    message: ErrorMessage.UserNameOrEmailExists
  },
  [ErrorCode.EmptyAccessToken]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: ErrorMessage.EmptyAccessToken
  },
  [ErrorCode.InvalidJwt]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: ErrorMessage.InvalidJwt
  },
  [ErrorCode.InvalidCredentials]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: ErrorMessage.InvalidCredentials
  }
}
