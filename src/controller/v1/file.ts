import { type Context, Controller, type NextHandler, Get, Delete } from '@kenote/core'
import { nextError } from '~/services/error'
import type { HttpError } from 'http-errors'
import * as Store from '~/services/store'
import { isArray } from 'lodash'

@Controller('/file')
export default class FileController {

  /**
   * 文件列表
   */
  @Get('/:type?')
  async list (ctx: Context, next: NextHandler) {
    let { type } = ctx.params
    try {
      let store = Store.getOptions(type)
      if (store.permission == 'directory') {
        let user = await ctx.getUser()
        if (!user) {
          return await ctx.status(401).send('Unauthorized')
        }
      }
      let result = await Store.getFilelist(store, ctx.query.dir)
      return ctx.api(result)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /**
   * 删除文件
   */
  @Delete('/:type?')
  async remove (ctx: Context, next: NextHandler) {
    let { type } = ctx.params
    let { files } = ctx.body
    try {
      let user = await ctx.getUser()
      if (!user) {
        return await ctx.status(401).send('Unauthorized')
      }
      let store = Store.getOptions(type)
      await Store.removeFiles(store, isArray(files) ? files : String(files).split(/\,/), ctx.query.dir)
      return ctx.api({ result: true })
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }
}
