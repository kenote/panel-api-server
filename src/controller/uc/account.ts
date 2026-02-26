import { type Context, Controller, type NextHandler, Post, Get, Delete, Put } from '@kenote/core'
import { nextError } from '~/services/error'
import createError, { type HttpError } from 'http-errors'
import * as filter from '~/filters/account'
import { createUser, verifyUser, safeUser, getGroup, isAdmin } from '~/services/db/user'
import { sendMailByVerifycode } from '~/services/db/verify'
import { tokenRepository } from '~/services/db/token'
import { authenticate } from '~/plugins/passport'

@Controller()
export default class AccountController {

  /** 
   * 用户登录
   */
  @Post('login/:type?', { filters: [ filter.login ]})
  async login (ctx: Context, next: NextHandler) {
    try {
      let user = await verifyUser(ctx.payload)
      if (ctx.params.type == 'profile') {
        let admin = isAdmin(user.username)
        let group = getGroup(user.username)
        return ctx.api({ user: safeUser(user), admin, group })
      }
      let token = await ctx.jwtlogin(user)
      return ctx.api(token)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /**
   * 验证访问令牌
   */
  @Get('/accesstoken', { filters: authenticate })
  async accessToken (ctx: Context, next: NextHandler) {
    try {
      let user = safeUser(ctx.user)!
      let admin = isAdmin(user.username)
      let group = getGroup(user.username)
      return ctx.api({ user, admin, group })
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /**
   * 刷新访问令牌
   */
  @Put('/refreshtoken', { filters: [ filter.refreshToken ] })
  async refreshToken (ctx: Context, next: NextHandler) {
    try {
      let result = await ctx.refreshToken(ctx.payload)
      return ctx.api(result)
    } catch (error) {
      if (error instanceof Error && /Token/.test(error.name)) {
        return ctx.api(null, createError(500, error.message))
      }
      nextError(error, ctx, next)
    }
  }

  /**
   * 注册用户
   */
  @Post('/register', { filters: [ filter.register ]})
  async register (ctx: Context, next: NextHandler) {
    try {
      let data = await createUser(ctx.payload)
      return ctx.api(data)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /**
   * 发送验证码
   */
  @Put('/sendcode', { filters: [ filter.sendCode ]})
  async sendcode (ctx:Context, next: NextHandler) {
    try {
      let result = await sendMailByVerifycode(ctx.payload)
      return ctx.api(result)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /**
   * 获取Tokens
   */
  @Get('/tokens')
  async tokens (ctx: Context, next: NextHandler) {
    try {
      let user = await ctx.getUser()
      if (!user) {
        return await ctx.status(401).send('Unauthorized')
      }
      let tokens = await tokenRepository.findBy({ uid: user.pid })
      return ctx.api(tokens)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }
}