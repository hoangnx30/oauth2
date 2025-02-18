import {
  AuthorizationRequestDto,
  AuthorizationResDto,
  LoginDtoReqBody,
  RegisterDtoReqBody,
  RegisterResDto
} from '../dtos'

export interface IOAuthController {
  authorize: (query: AuthorizationRequestDto) => Promise<AuthorizationResDto>
}

export interface IAuthController {
  register: (body: RegisterDtoReqBody) => Promise<RegisterResDto>
  login: (body: LoginDtoReqBody) => any
}
