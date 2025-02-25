import {Body, ClassSerializerInterceptor, Controller, Headers, Ip, Post, UseInterceptors} from '@nestjs/common'
import {CommandBus} from '@nestjs/cqrs'
import {ApiTags} from '@nestjs/swagger'
import {Throttle} from '@nestjs/throttler'

import {LoginCommand} from '@/oauth/application/commands/login.command'
import {RegisterCommand} from '@/oauth/application/commands/register.command'

import {LoginDocs, LoginDtoReqBody, LoginResDto, RegisterDocs, RegisterDtoReqBody, RegisterResDto} from '../dtos'
import {IAuthController} from './interface'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @Throttle({default: {limit: 5, ttl: 60000}}) // 5 requests per minute
  @RegisterDocs()
  async register(@Body() body: RegisterDtoReqBody): Promise<RegisterResDto> {
    const {email, username, password} = body
    const command = new RegisterCommand(email, username, password)

    const commandResult = await this.commandBus.execute(command)

    return new RegisterResDto(commandResult)
  }

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  @Throttle({default: {limit: 10, ttl: 60000}}) // 10 requests per minute
  @LoginDocs()
  async login(
    @Body() body: LoginDtoReqBody,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string
  ): Promise<LoginResDto> {
    const {email, password, oauthRequestId} = body

    const command = new LoginCommand(email, password, oauthRequestId, ipAddress, userAgent)
    const res = await this.commandBus.execute(command)

    return new LoginResDto(res)
  }
}
