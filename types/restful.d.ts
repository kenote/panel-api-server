import { HttpError } from 'http-errors'
import { SafeUser } from './db/user'
import { User } from '~/entities'
import { Context } from '@kenote/core'

export declare interface Restful {
  api<t = any> (data: t, error?: HttpError): void
  notfound (): Promise<void>
  clientIP: string
  jwToken: string
  jwtlogin (user: User): Promise<AuthToken>
  refreshToken (body: Account.refresh): Promise<AuthToken | null>
  getUser (): Promise<SafeUser | undefined | null>
  sendStream (content: string, options?: StreamOptions): Context
}

export declare interface StreamOptions {
  mode          : 'preview' | 'stream' | 'download'
  contentType  ?: string
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