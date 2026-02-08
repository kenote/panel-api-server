import { type Context, Controller, type NextHandler, Post, Delete } from '@kenote/core'
import { nextError } from '~/services/error'
import type { HttpError } from 'http-errors'
import * as filter from '~/filters/token'
import { tokenRepository, createToken } from '~/services/db/token'
import { isArray } from 'lodash'

@Controller('token')
export default class TokenController {

  /**
   * 创建Token
   */
  @Post('/create', { filters: [ filter.createToken ] })
  async createToken (ctx: Context, next: NextHandler) {
    try {
      let token = await createToken(ctx.payload)
      return ctx.api(token)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /**
   * 编辑Token
   */
  @Post('/:id', { filters: [ filter.createToken ] })
  async editToken (ctx: Context, next: NextHandler) {
    try {
      let result = await tokenRepository.update({ id: ctx.params.id, uid: ctx.payload.uid }, ctx.payload)
      return ctx.api(result)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /**
   * 删除Token
   */
  @Delete('/:id?')
  async removeToken (ctx: Context, next: NextHandler) {
    try {
      let user = await ctx.getUser()
      if (!user) {
        return await ctx.status(401).send('Unauthorized')
      }
      if (ctx.params.id) {
        let result = await tokenRepository.delete({ id: ctx.params.id, uid: user.pid })
        return ctx.api(result)
      }
      let ids = isArray(ctx.body.ids) ? ctx.body.ids : String(ctx.body.ids).split(/\,/).map(Number)
      let result = await tokenRepository.createQueryBuilder('token')
        .where("token.id IN (:...ids)", { ids })
        .andWhere("token.uid = :uid", { uid: user.pid })
        .delete().execute()
      return ctx.api(result)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }
}