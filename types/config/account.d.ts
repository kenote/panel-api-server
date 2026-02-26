import { RandomOptions } from '@/types'
import { StringValue } from 'ms'

/** 账号配置 */
export declare interface AccountConfigure {
  encryptRule     : string
  randomOptions   : RandomOptions | number
  invitation      : string
  admins          : string[]
  groups          : AccountGroup[]
  verifyCode      : VerifyCode | StringValue | number
  adminGroup      : string
}

/** 验证码配置 */
export declare type VerifyCode = {
  timeout   : StringValue | number
}

/** 账号分组 */
export declare type AccountGroup = {
  key          : string
  name         : string
  invitation  ?: string
  users        : string[] | 'normal'
}