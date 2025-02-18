import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'

import {ErrorCode} from '../errors/error-code'
import {HttpException} from '../errors/http-exception'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractJwt(request)

    if (!token) {
      throw new HttpException(ErrorCode.EmptyAccessToken)
    }

    try {
      // Verify JWT without database lookup
      const payload = this.jwtService.verify(token)
      request.user = payload
      return true
    } catch {
      throw new HttpException(ErrorCode.InvalidJwt)
    }
  }

  private extractJwt(request: Request): string | null {
    const authHeader = request.headers['Authorization']
    if (!authHeader) return null

    const [type, token] = authHeader.split(' ')
    return type === 'Bearer' ? token : null
  }
}
