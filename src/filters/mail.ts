import { type Context, type NextHandler } from '@kenote/core'
import { filterData, FilterData } from 'parse-string'
import { nextError } from '~/services/error'
import { type HttpError } from 'http-errors'
import { cleanNaNByPayload } from '.'
import { smtpMode } from '~/services/mailer'

/**
 * 发送邮件
 */
export async function send (ctx: Context, next: NextHandler) {
  let filters = <FilterData.options[]> [
    {
      key: 'from',
      type: 'string',
      rules: [
        { required: true, message: '发件人不能为空', code: 1000 }
      ]
    },
    {
      key: 'to',
      type: 'string[]',
      rules: [
        { required: true, message: '收件人不能为空', code: 1000 }
      ]
    },
    {
      key: 'subject',
      type: 'string',
      rules: [
        { required: true, message: '邮件标题不能为空', code: 1000 }
      ]
    },
    {
      key: 'html',
      type: 'string',
      rules: [
        { required: true, message: '邮件内容不能为空', code: 1000 }
      ]
    },
  ]
  try {
    if (smtpMode == 'api') {
      return await ctx.notfound()
    }
    let user = await ctx.getUser()
    if (!user) {
      return await ctx.status(401).send('Unauthorized')
    }
    let result = filterData(filters)(ctx.body)
    ctx.payload = cleanNaNByPayload(result)
    return next()
  } catch (error) {
    if (error instanceof Error) {
      nextError(<HttpError>error, ctx, next)
    }
  }
}