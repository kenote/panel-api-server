import { type Context, Controller, type NextHandler, Post, Get, Delete, Put } from '@kenote/core'
import { nextError } from '~/services/error'
import type { HttpError } from 'http-errors'
import * as filter from '~/filters/account'
import { createUser, verifyUser, safeUser } from '~/services/db/user'
import { sendMailByVerifycode } from '~/services/db/verify'
import { tokenRepository } from '~/services/db/token'

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
        return ctx.api(safeUser(user))
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