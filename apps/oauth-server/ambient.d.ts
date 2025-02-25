import 'express'

import {User} from './common/models'

declare module 'express' {
  export interface Request {
    user?: {
      id: number
      username: string
    }
  }
}
