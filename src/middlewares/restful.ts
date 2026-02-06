import { Action, type Context, Middleware, Property } from '@kenote/core'
import type { HttpError } from 'http-errors'
import type { Restful, AuthToken, Account } from '@/types/restful'
import { setJwToken, verifyJwToken } from './auth'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '@/types/config'
import { userRepository, safeUser } from '~/servies/db/user'
import type { User } from '~/entities'

const { SECRET_KEY, expiresIn, REFRESH_SECRET, refreshExpires } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })

@Middleware()
export default class restful {

  @Action()
  api<T =any> (ctx:Context) {
    return (data: T, error?: HttpError) => {
      if (error != null) {
        ctx.json({ error: error?.message })
      }
      else {
        ctx.json({ data })
      }
    }
  }

  @Action()
  notfound (ctx: Context) {
    return async () => {
      await ctx.status(404).render('error', {
        code: 404,
        message: `This page could not be found.`
      })
    }
  }

  @Property()
  clientIP (ctx: Context) {
    return ctx.headers?.['x-forwarded-for']
    ?? ctx.headers?.['x-real-ip']
    ?? ctx.connection?.remoteAddress
    ?? ctx.req.socket?.remoteAddress
    ?? ctx.ip
  }

  @Property()
  jwToken (ctx: Context) {
    return ctx.headers.authorization?.replace(/^(Bearer)\s{1}/, '')
  }

  @Action()
  jwtLogin (ctx: Context) {
    return async (user: User) => {
      let authToken = await updateToken(user.pid)
      ctx.cookie('jwtoken', authToken.accessToken)
      authToken.user = safeUser(user)
      return authToken
    }
  }

  @Action()
  refreshToken (ctx: Context) {
    return async (body: Account.refresh) => {
      let { refreshToken, pid } = body
      let payload = verifyJwToken(refreshToken, REFRESH_SECRET)
      if (payload?.pid == pid) {
        let authToken = await updateToken(payload.pid)
        ctx.cookie('jwtoken', authToken.accessToken)
        return authToken
      }
      return null
    }
  }
}

declare module '@kenote/core' {
  interface Context extends Restful {
    
  }
}

/**
 * 更新 Token
 * @param pid 
 * @returns 
 */
async function updateToken (pid: string) {
  let accessToken = setJwToken({ pid }, SECRET_KEY, { expiresIn })
  let refreshToken = setJwToken({ pid }, REFRESH_SECRET, { expiresIn: refreshExpires } )
  await userRepository.update({ pid }, { jwtoken: accessToken })
  return <AuthToken> { accessToken, refreshToken }
}