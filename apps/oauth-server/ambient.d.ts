import 'express'

import {User} from './common/models'

declare module 'express' {
  export interface Request {
    user?: {
      id: string
      username: string
    }
  }
}
