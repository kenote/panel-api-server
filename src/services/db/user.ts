import AppDataSource from '~/services/data'
import { User } from '~/entities'
import type { QueryUser, NewUser, SafeUser, VerifyUser } from '@/types/db/user'
import { merge, omit, pick, isArray } from 'lodash'
import * as uuid from 'uuid'
import { httpError, ErrorCode } from '~/services/error'
import { check } from './verify'
import * as Bcrypt from '~/services/bcrypt'
import { loadConfig } from '@kenote/config'
import type { AccountConfigure } from '@/types/config/account'
import { sender, parseMailUser, sendMail } from '~/services/mailer'
import { getEnv } from '~/services'
import type Mail from 'nodemailer/lib/mailer'
import { setConfig } from '~/services/setting'

export const userRepository = AppDataSource.getRepository(User)
const { encryptRule, randomOptions } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })

/**
 * 验证用户
 * @param body 
 * @returns 
 */
export async function verifyUser(body: VerifyUser) {
  let user = await userRepository.createQueryBuilder('user')
    .where("user.username = :username OR user.email = :username", { username: body.username })
    .getOne()
  if (!user) {
    throw httpError(ErrorCode.ERROR_LOGINVALID_FAIL)
  }
  if (body.target && /^(pid)\:{1}/.test(body.target)) {
    let [ ,pid ] = body.target.split(/\:/)
    await check(body.password, pid)
  }
  else {
    let valide = Bcrypt.compare(encryptRule)(body.password, user.encrypt, user.salt)
    if (!valide) {
      throw httpError(ErrorCode.ERROR_LOGINVALID_FAIL)
    }
  }
  return user
}

/**
 * 创建用户
 * @param body 
 * @returns 
 */
export async function createUser (body: NewUser & { invitation: string }) {
  let isUsername = await userRepository.findOneBy({ username: body.username })
  if (isUsername) {
    throw httpError(ErrorCode.ERROR_VALID_USERNAME_UNIQUE)
  }
  let isEmail = await userRepository.findOneBy({ email: body.email })
  if (isEmail) {
    throw httpError(ErrorCode.ERROR_VALID_EMAIL_UNIQUE)
  }
  let user = merge(omit(body, ['password', 'target', 'invitation']), <Partial<User>> {
    pid: uuid.v7(), 
    token: `ck-${uuid.v7().replace(/\-/g, '')}`
  })
  let pass
  if (body.target && /^(pid)\:{1}/.test(body.target)) {
    let [ ,pid ] = body.target.split(/\:/)
    await check(body.password, pid)
  }
  else {
    pass = body.password ?? Bcrypt.randomString(randomOptions)
    let { encrypt, salt } = Bcrypt.encode(encryptRule)(pass)
    user.encrypt = encrypt
    user.salt = salt
  }
  let result = await userRepository.insert(user)
  let { invitation, groups } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
  let group = groups?.find(v => v.invitation === body.invitation)
  if (isArray(group?.users)) {
    group.users.push(user.username)
    setConfig<AccountConfigure>('account', { groups })
  }
  if (body.invitation === invitation) {
    setConfig<AccountConfigure>('account', { admins: [user.username] })
  }
  if (!body.password) {
    sendMailByNewuser(body, pass)
  }
  return result
}

/**
 * 判断是否管理员
 * @param username 
 * @returns 
 */
export function isAdmin (username: string) {
  let { admins } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
  return admins?.includes(username)
}

/**
 * 获取用户分组
 * @param username 
 * @returns 
 */
export function getGroup (username: string) {
  let { groups, admins, adminGroup } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
  let group = groups?.filter( v => v?.users?.includes(username) ) ?? groups?.filter( v => v.users === 'normal' ) ?? []
  let admin = admins?.includes(username)
  if (admin) {
    group.unshift({ key: 'admin', name: adminGroup, users: [] })
  }
  return group.map( v => pick(v, ['key', 'name']) )
}

/**
 * 分组列表
 * @returns 
 */
export function getGrouplist () {
  let { groups, admins, invitation, adminGroup } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
  groups?.unshift({ key: 'admin', name: adminGroup, invitation, users: admins??[] })
  return groups
}

/**
 * 用户数据 (去除登录信息)
 * @param body 
 * @param payload 
 * @returns 
 */
export function safeUser (body: User, payload?: Partial<SafeUser>) {
  if (!body) return
  let user = merge(body, payload)
  return <SafeUser>omit(user, ['encrypt', 'salt', 'jwtoken'])
}

/**
 * 发送新用户邮件
 * @param user 
 * @param pass 
 */
export function sendMailByNewuser (user: NewUser, pass: string) {
  let { SITE_HOST, SITE_NAME } = getEnv()
  let mail = <Mail.Options> {
    from: sender,
    to: parseMailUser(user),
    subject: `${SITE_NAME} - 电子邮箱验证`
  }
  let content = {
    SITE_HOST,
    SITE_NAME,
    username: user.username,
    password: pass
  }
  sendMail('newuser.mjml', content)(mail)
}