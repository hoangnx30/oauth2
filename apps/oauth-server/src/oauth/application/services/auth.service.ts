import {Injectable} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  createAccessToken(userId: number, username: string, email: string) {
    const payload = {sub: userId, username, email}
    const accessToken = this.jwtService.sign(payload, {expiresIn: '1h'})

    return accessToken
  }

  createRefreshToken(userId: number, username: string, email: string) {
    const payload = {sub: userId, username, email}
    const refreshToken = this.jwtService.sign(payload, {expiresIn: '30d'})

    return refreshToken
  }
}
