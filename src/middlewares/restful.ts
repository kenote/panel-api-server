import { Action, type Context, Middleware, Property } from '@kenote/core'
import type { HttpError } from 'http-errors'
import type { Restful, AuthToken, Account, StreamOptions } from '@/types/restful'
import { setJwToken, verifyJwToken } from './auth'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '@/types/config'
import { userRepository, safeUser } from '~/services/db/user'
import type { User } from '~/entities'
import { tokenRepository } from '~/services/db/token'
import { Readable } from 'stream'
import * as Store from '~/services/store'
import fs from 'fs'
import { ErrorCode, httpError } from '~/services/error'
import logger from '~/services/logger'

const { SECRET_KEY, expiresIn, REFRESH_SECRET, refreshExpires } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })

@Middleware()
export default class restful {

  @Action()
  api<T =any> (ctx:Context) {
    return (data: T, error?: HttpError) => {
      let body: { data?: any, error?: string } = { data }
      if (error != null) {
        body = { error: error?.message }
      }
      logger.info('RESPONSE', body)
      return ctx.json(body)
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

  @Action()
  getUser (ctx: Context) {
    return async () => {
      // 使用APIKey
      if (/^(sk)\-{1}/.test(ctx.jwToken) && /^\/(v1|upload)\/{1}/.test(ctx.path)) {
        let token = await tokenRepository.findOneBy({ token: ctx.jwToken })
        if (token) {
          if (token.expireTime > 0 && (token.expireTime < Date.now())) {
            return null
          }
          let user = await userRepository.findOneBy({ pid: token.uid })
          return safeUser(user!)
        }
        return null
      }
      // 使用用户令牌
      if (/^(ck)\-{1}/.test(ctx.jwToken)) {
        let user = await userRepository.findOneBy({ token: ctx.jwToken })
        return safeUser(user!)
      }
      // 使用JWT
      let payload = verifyJwToken(ctx.jwToken, SECRET_KEY)
      if (payload) {
        let user = await userRepository.findOneBy({ pid: payload.pid, jwtoken: ctx.jwToken })
        return safeUser(user!)
      }
      return null
    }
  }

  @Action()
  sendStream (ctx: Context) {
    return (content: string, options: StreamOptions = { mode: 'stream', contentType: 'application/octet-stream' }) => {
      let contentType = options.contentType
      let fileStream: Buffer | Readable | null
      if (options.mode === 'stream') {
        contentType = 'application/octet-stream'
        fileStream = new Readable()
        fileStream.push(content)
        fileStream.push(null)
      }
      else {
        if (!fs.existsSync(content)) {
          throw httpError(ErrorCode.ERROR_FILENAME_NOTEXISTS)
        }
        contentType = Store.getContentType(content, options)
        fileStream = fs.readFileSync(content)
      }
      ctx.setHeader('Content-Type', contentType)
      return ctx.send(fileStream)
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