import { type Context, type NextHandler } from '@kenote/core'
import { filterData, FilterData } from 'parse-string'
import { nextError } from '~/services/error'
import type { HttpError } from 'http-errors'
import { cleanNaNByPayload } from '.'

export async function unzip (ctx: Context, next: NextHandler) {
  let filters = <FilterData.options[]> [
    {
      key: 'zipfile',
      type: 'string',
      rules: [
        { required: true, message: 'ZIP文件不能为空', code: 1000 }
      ]
    },
    {
      key: 'output',
      type: 'string'
    }
  ]
  try {
    let user = await ctx.getUser()
    if (!user) {
      return await ctx.status(401).send('Unauthorized')
    }
    let result = filterData(filters)(ctx.body)
    result.uid = user.pid
    ctx.payload = cleanNaNByPayload(result)
    return next()
  } catch (error) {
    if (error instanceof Error) {
      nextError(<HttpError>error, ctx, next)
    }
  }
}

export async function archiver (ctx: Context, next: NextHandler) {
  let filters = <FilterData.options[]> [
    {
      key: 'name',
      type: 'string',
    },
    {
      key: 'type',
      type: 'string',
      rules: [
        { 
          validator:  (value: string) => ['zip', 'tar'].includes(value),
          message: '归档文件类型不支持',
          code: 1000 
        }
      ],
      defaultValue: 'zip'
    },
    {
      key: 'level',
      type: 'string',
      rules: [
        { 
          validator:  (value: string) => /^[1-9]{1}$/.test(value),
          message: '压缩等级请选择 [1-9] 范围内',
          code: 1000 
        }
      ],
      format: [{ type: 'number' }],
      defaultValue: 9
    },
    {
      key: 'content',
      type: 'string[]',
      defaultValue: []
    }
  ]
  try {
    let user = await ctx.getUser()
    if (!user) {
      return await ctx.status(401).send('Unauthorized')
    }
    let result = filterData(filters)(ctx.body)
    result.uid = user.pid
    ctx.payload = cleanNaNByPayload(result)
    return next()
  } catch (error) {
    if (error instanceof Error) {
      nextError(<HttpError>error, ctx, next)
    }
  }
}