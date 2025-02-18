import {
  AuthorizationRequestDto,
  AuthorizationResDto,
  LoginDtoReqBody,
  LoginResDto,
  RegisterDtoReqBody,
  RegisterResDto
} from '../dtos'

export interface IOAuthController {
  authorize: (query: AuthorizationRequestDto) => Promise<AuthorizationResDto>
}

export interface IAuthController {
  register: (body: RegisterDtoReqBody) => Promise<RegisterResDto>
  login: (body: LoginDtoReqBody, ipAddress: string, userAgent: string) => Promise<LoginResDto>
}
