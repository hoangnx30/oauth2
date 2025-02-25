import {Request, Response} from 'express'

import {AuthorizationRequestDto, LoginDtoReqBody, LoginResDto, RegisterDtoReqBody, RegisterResDto} from '../dtos'

export interface IOAuthController {
  authorize: (query: AuthorizationRequestDto, response: Response) => Promise<void>
}

export interface IAuthController {
  register: (body: RegisterDtoReqBody) => Promise<RegisterResDto>
  login: (body: LoginDtoReqBody, ipAddress: string, userAgent: string) => Promise<LoginResDto>
}
