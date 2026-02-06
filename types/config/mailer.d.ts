import { MailerSetting } from '@kenote/mailer'

/** SMTP 配置 */
export declare interface MailerConfigure extends MailerSetting {
  smtpMode ?: 'nodemailer' | 'api'
  smtpAPI  ?: SMTPAPIOptions
}

/** SMTP API选项 */
export declare type SMTPAPIOptions = {
  host      : string
  apikey    : string
  sender    : string
}