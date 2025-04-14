import { User } from '../../user/user.entity'

declare module 'express' {
  interface Request {
    user: {
      id: string
      email: string
    }
  }
}
