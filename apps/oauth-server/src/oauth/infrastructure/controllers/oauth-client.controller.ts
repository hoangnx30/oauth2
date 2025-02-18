import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common'
import {CommandBus} from '@nestjs/cqrs'
import {Throttle} from '@nestjs/throttler'

import {JwtAuthGuard} from '@/common/guards/jwt.guard'

import {CreateOAuthClientCommand} from '@/oauth/application/commands'

import {CreateOAuthClientDto, CreateOAuthClientResDto} from '../dtos'

@Controller('oauth/clients')
@UseGuards(JwtAuthGuard)
export class OAuthClientController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Throttle({default: {limit: 10, ttl: 60000}}) // 10 requests per minute
  async createClient(@Body() body: CreateOAuthClientDto, @Request() req) {
    // Create the client
    const command = new CreateOAuthClientCommand(
      body.clientName,
      body.clientUri,
      body.redirectUris,
      req.user.sub,
      body.scope,
      body.isConfidential
    )
    const client = await this.commandBus.execute(command)

    // Log the creation for audit purposes
    console.log(`OAuth client created by ${req.user.id} at ${new Date('2025-02-17 10:46:18').toISOString()}`)

    return new CreateOAuthClientResDto(client)
  }
}
