import AppDataSource from '~/services/data'
import { Verify } from '~/entities'
import type { NewVerify } from '@/types/db/verify'
import { httpError, ErrorCode } from '~/services/error'
import * as uuid from 'uuid'
import { isNumber, isString } from 'lodash'
import { loadConfig } from '@kenote/config'
import type { AccountConfigure, VerifyCode } from '@/types/config/account'
import ms from 'ms'
import { sender, parseMailUser, sendMail } from '~/services/mailer'
import { getEnv } from '~/services'
import type Mail from 'nodemailer/lib/mailer'
import type { QueryUser, SafeUser } from '@/types/db/user'
import { LessThan } from 'typeorm'

export const verifyRepository = AppDataSource.getRepository(Verify)

/**
 * 创建验证码
 * @param body 
 * @returns 
 */
export async function createVerify (body: Partial<NewVerify>) {
  let code = Math.random().toFixed(6).replace(/^(0\.)/i, '')
  body.code = code
  body.target = uuid.v7()
  // 移除 24 小时前的验证码
  await verifyRepository.delete({
    createAt: LessThan(new Date(Date.now() - 24 * 60 * 60 * 1000))
  })
  let result = await verifyRepository.insert(body)
  return { result, code, pid: body.target }
}

/**
 * 发送验证码
 * @param user 
 */
export async function sendMailByVerifycode (user: SafeUser | Partial<QueryUser>) {
  let { SITE_HOST, SITE_NAME } = getEnv()
  let { verifyCode } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
  let timeout: number | string = (<VerifyCode>verifyCode)?.timeout ?? verifyCode
  if (isNumber(timeout)) timeout = ms(timeout)
  let mail = <Mail.Options> {
    from: sender,
    to: parseMailUser(user),
    subject: `${SITE_NAME} - 验证码`,
    html: ''
  }
  let verify = await createVerify({ address: user.email, uid: user.pid })
  let content = {
    SITE_HOST,
    SITE_NAME,
    timeout: timeout.replace(/(minutes|minute|mins|min|m)$/, ' 分钟'),
    code: verify.code
  }
  sendMail('sendcode.mjml', content)(mail)
  return { pid: verify.pid, id: verify.result.identifiers?.[0].id }
}

/**
 * 验证码校验
 * @param code 
 * @param pid 
 * @returns 
 */
export async function check (code: string, pid: string) {
  let { verifyCode } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
  let timeout = (<VerifyCode>verifyCode)?.timeout ?? verifyCode
  if (isString(timeout)) timeout = ms(timeout)
  let verify = await verifyRepository.createQueryBuilder('verify')
    .where("verify.target = :pid AND verify.code = :code", { code, pid })
    .andWhere("verify.verified = :verified", { verified: false })
    .getOne()
  if (!verify) {
    throw httpError(ErrorCode.ERROR_VERIFY_CODE_FAILED)
  }
  let difftime = Date.now() - verify.createAt.getTime()
  if (difftime > timeout) {
    throw httpError(ErrorCode.ERROR_VERIFY_CODE_TIMEOUT)
  }
  await verifyRepository.update({ id: verify.id }, { verified: true })
}