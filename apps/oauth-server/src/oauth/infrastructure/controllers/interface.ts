import {Request} from 'express'

import {
  AuthorizationRequestDto,
  AuthorizationResDto,
  LoginDtoReqBody,
  LoginResDto,
  RegisterDtoReqBody,
  RegisterResDto
} from '../dtos'

export interface IOAuthController {
  authorize: (query: AuthorizationRequestDto, request: Request) => Promise<AuthorizationResDto>
}

export interface IAuthController {
  register: (body: RegisterDtoReqBody) => Promise<RegisterResDto>
  login: (body: LoginDtoReqBody, ipAddress: string, userAgent: string) => Promise<LoginResDto>
}
