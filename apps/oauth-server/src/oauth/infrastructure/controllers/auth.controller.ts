import {Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors} from '@nestjs/common'
import {CommandBus} from '@nestjs/cqrs'
import {ApiTags} from '@nestjs/swagger'
import {Throttle} from '@nestjs/throttler'

import {LoginCommand} from '@/oauth/application/commands/login.command'
import {RegisterCommand} from '@/oauth/application/commands/register.command'

import {LoginDtoReqBody, LoginResDto, RegisterDocs, RegisterDtoReqBody, RegisterResDto} from '../dtos'
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

    return this.commandBus.execute(command)
  }

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  @Throttle({default: {limit: 10, ttl: 60000}}) // 10 requests per minute
  async login(@Body() body: LoginDtoReqBody): Promise<LoginResDto> {
    const {email, password} = body

    const command = new LoginCommand(email, password)

    const res = await this.commandBus.execute(command)

    return new LoginResDto(res)
  }
}
