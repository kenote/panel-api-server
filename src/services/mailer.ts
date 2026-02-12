import { Mailer } from '@kenote/mailer'
import { resolve } from 'path'
import { loadConfig } from '@kenote/config'
import { renderString } from 'nunjucks'
import { getEnv } from './'
import type { QueryUser, SafeUser } from '@/types/db'
import logger from './logger'
import { MailerConfigure } from '@/types/config'
import type Mail from 'nodemailer/lib/mailer'
import { sendHttp } from './http'

export const { smtpOptions, asyncRetryOptions, smtpMode, smtpAPI } = loadConfig<MailerConfigure>('config/mailer', { mode: 'merge' })

/**
 * 邮件发送对象
 */
export const mailer = new Mailer({
  mailDir: resolve(process.cwd(), 'mails'),
  smtpOptions,
  asyncRetryOptions,
  renderString
})

/**
 * 邮件发送者
 */
export const sender = `${getEnv().SITE_NAME} <${smtpMode == 'api' ? smtpAPI?.sender : smtpOptions?.auth?.user}>`

/**
 * 收件人
 * @param user 
 * @returns 
 */
export const parseMailUser = (user: Partial<QueryUser> | SafeUser) => `${user.username??user.email} <${user.email}>`

/**
 * 发送回调函数
 * @param err 
 * @param info 
 */
export function sendMailNext (err: any, info: any) {
  if (err) {
    logger.error(err?.message)
  }
  logger.info(info)
}

/**
 * 发送模版邮件
 * @param filename 
 * @param content 
 * @returns 
 */
export function sendMail (filename: string, content?: Record<string, any>) {
  return async (mail: Mail.Options) => {
    if (smtpMode == 'api') {
      let html = mailer.renderMail(filename, content)
      mail.html = html
      sendMailAPI(mail).then( ret => {
        sendMailNext(null, ret?.data)
      })
      .catch( err => {
        sendMailNext(err, null)
      })
    }
    else {
      mailer.sendMail(filename, content)(mail, sendMailNext)
    }
  }
}

/**
 * API方式发送邮件
 * @param mail 
 * @returns 
 */
async function sendMailAPI (mail: Mail.Options) {
  let result = await sendHttp({ 
    method: 'POST', 
    url: `${smtpAPI?.host}/v1/mail/send`,
    headers: {
      Authorization: `Bearer ${smtpAPI?.apikey}`
    },
    body: mail
  })
  return result
}