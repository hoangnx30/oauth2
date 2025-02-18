import {Injectable} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  createAccessToken(userId: string, username: string) {
    const payload = {sub: userId, username}
    const accessToken = this.jwtService.sign(payload, {expiresIn: '1h'})

    return accessToken
  }

  createRefreshToken(userId: string, username: string) {
    const payload = {sub: userId, username}
    const refreshToken = this.jwtService.sign(payload, {expiresIn: '30d'})

    return refreshToken
  }
}
