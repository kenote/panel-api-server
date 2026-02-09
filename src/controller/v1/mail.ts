import { type Context, Controller, type NextHandler, Post } from '@kenote/core'
import { nextError } from '~/services/error'
import type { HttpError } from 'http-errors'
import type Mail from 'nodemailer/lib/mailer'
import { htmlToText } from 'html-to-text'
import { mailer, sendMailNext } from '~/services/mailer'
import * as filter from '~/filters/mail'

@Controller('/mail')
export default class MailController {

  @Post('/send', { filters: [ filter.send ]})
  async send (ctx: Context, next: NextHandler) {
    try {
      let mail = <Mail.Options>ctx.payload
      if (!mail.text) {
        mail.text = htmlToText(<string>mail.html)
      }
      let result = await new Promise((resolve, reject) => {
        mailer.asyncSend(mail, (err, info) => {
          sendMailNext(err, info)
          if (err) {
            reject(err)
          }
          else {
            resolve(info)
          }
        })
      })
      return ctx.api(result)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }
}