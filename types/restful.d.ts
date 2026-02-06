import { HttpError } from 'http-errors'
import { SafeUser } from './db/user'
import { User } from '~/entities'

export declare interface Restful {
  api<t = any> (data: t, error?: HttpError): void
  notfound (): Promise<void>
  clientIP: string
  jwToken: string
  jwtlogin (user: User): Promise<AuthToken>
  refreshToken (body: Account.refresh): Promise<AuthToken | null>
}

export declare type AuthToken = {
  user        ?: SafeUser
  accessToken  : string
  refreshToken : string
}

export declare namespace Account {
  interface refresh {
    refreshToken  : string
    pid           : string
  }
}