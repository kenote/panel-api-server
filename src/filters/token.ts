import { type Context, type NextHandler } from '@kenote/core'
import { filterData, FilterData } from 'parse-string'
import { nextError } from '~/services/error'
import type { HttpError } from 'http-errors'
import { cleanNaNByPayload } from '.'

/**
 * 创建Token
 */
export async function createToken (ctx: Context, next: NextHandler) {
  let filters = <FilterData.options[]> [
    {
      key: 'name',
      type: 'string',
      rules: [
        { required: true, message: '名称不能为空', code: 1000 }
      ]
    },
    {
      key: 'expireTime',
      type: 'string',
      format: [
        {
          type: 'date',
          func: 'getTime'
        }
      ]
    }
  ]
  try {
    let user = await ctx.getUser()
    if (!user) {
      return await ctx.status(401).send('Unauthorized')
    }
    let result = filterData(filters)(ctx.body)
    result.uid = user?.pid
    ctx.payload = cleanNaNByPayload(result)
    return next()
  } catch (error) {
    if (error instanceof Error) {
      nextError(<HttpError>error, ctx, next)
    }
  }
}