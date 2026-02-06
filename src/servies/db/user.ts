import AppDataSource from '~/servies/data'
import { User } from '~/entities'
import type { QueryUser, NewUser, SafeUser, VerifyUser } from '@/types/db/user'
import { merge, omit } from 'lodash'

export const userRepository = AppDataSource.getRepository(User)

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