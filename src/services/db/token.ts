import AppDataSource from '~/services/data'
import { Token } from '~/entities'
import type { NewToken } from '@/types/db/token'
import * as uuid from 'uuid'

export const tokenRepository = AppDataSource.getRepository(Token)

/**
 * 创建Token
 * @param body 
 * @returns 
 */
export async function createToken (body: Partial<NewToken>) {
  body.token = `sk-${uuid.v7().replace(/\-/g, '')}`
  let result = await tokenRepository.insert(body)
  return result
}
