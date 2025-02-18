import {Injectable} from '@nestjs/common'
import crypto from 'crypto'

@Injectable()
export class OAuthClientService {
  generateClientId(): string {
    // Generate a URL-safe, base64 encoded string
    return crypto.randomBytes(32).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  generateClientSecret(): string {
    // Generate a secure random string for client secret
    return crypto.randomBytes(48).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }
}
