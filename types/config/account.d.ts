import { RandomOptions } from '@/types'
import { StringValue } from 'ms'

/** 账号配置 */
export declare interface AccountConfigure {
  encryptRule    ?: string
  randomOptions  ?: RandomOptions | number
  invitation     ?: string
  admins         ?: string[]
  verifyCode     ?: VerifyCode | StringValue | number
}

/** 验证码配置 */
export declare type VerifyCode = {
  timeout   : StringValue | number
}