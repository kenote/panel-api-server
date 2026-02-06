import { type Context, type NextHandler } from '@kenote/core'
import { filterData, FilterData } from 'parse-string'
import { nextError } from '~/services/error'
import type { HttpError } from 'http-errors'
import { cleanNaNByPayload } from '.'
import { unset } from 'lodash'
import validator from 'validator'
import { loadConfig } from '@kenote/config'
import type { AccountConfigure } from '@/types/config/account'

/**
 * 用户登录
 */
export function login (ctx: Context, next: NextHandler) {
  let filters = <FilterData.options[]> [
    {
      key: 'username',
      type: 'string',
      rules: [
        { required: true, message: '用户名不能为空', code: 1000 }
      ]
    },
    {
      key: 'password',
      type: 'string',
      rules: [
        { required: true, message: `${/^(pid)\:{1}/.test(ctx.body.target??'')?'验证码':'密码'}不能为空`, code: 1000 }
      ]
    },
    {
      key: 'target',
      type: 'string'
    }
  ]
  try {
    let result = filterData(filters)(ctx.body)
    ctx.payload = cleanNaNByPayload(result)
    return next()
  } catch (error) {
    if (error instanceof Error) {
      nextError(<HttpError>error, ctx, next)
    }
  }
}

/**
 * 注册用户
 */
export function register (ctx: Context, next: NextHandler) {
  let { invitation } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
  let filters = <FilterData.options[]> [
    {
      key: 'username',
      type: 'string',
      rules: [
        { required: true, message: '用户名不能为空', code: 1000 },
        { pattern: /^[a-zA-Z]{1}[a-zA-Z0-9\_\-]/, message: '用户名必须英文字符开头，可包含英文字符、数字、下划线及中划线', code: 1000 },
        { min: 5, max: 20, message: '用户名长度限定 5 - 20 位字符', code: 1000 }
      ]
    },
    {
      key: 'email',
      type: 'string',
      rules: [
        { required: true, message: '电子邮箱不能为空', code: 1000 },
        { validator: validator.isEmail, message: '请输入正确的邮箱地址，如 example@163.com', code: 1000 }
      ]
    },
    {
      key: 'target',
      type: 'string'
    }
  ]
  if (ctx.body.target && /^(pid)\:{1}/.test(ctx.body.target)) {
    filters.push({
      key: 'password',
      type: 'string',
      rules: [
        { required: true, message: '验证码不能为空', code: 1000 }
      ]
    })
  }
  else {
    filters.push({
      key: 'password',
      type: 'string',
      rules: [
        { required: true, message: '密码不能为空', code: 1000 },
        { pattern: /^(?=.*[A-Za-z])[A-Za-z0-9$@$!%*#?&]/, message: '密码字段必须包含英文字符，可包含英文字符、数字和符号', code: 1000 },
        { min: 8, max: 20, message: '密码长度限定 8 - 20 位字符', code: 1000 }
      ]
    })
  }
  if (invitation) {
    filters.push({
      key: 'invitation',
      type: 'string',
      rules: [
        { required: true, message: '邀请码不能为空', code: 1000 },
        { validator: value => value == invitation, message: '邀请码不正确', code: 1000 }
      ]
    })
  }
  try {
    let result = filterData(filters)(ctx.body)
    unset(result, 'invitation')
    ctx.payload = cleanNaNByPayload(result)
    return next()
  } catch (error) {
    if (error instanceof Error) {
      nextError(<HttpError>error, ctx, next)
    }
  }
}

/**
 * 发送验证码
 */
export async function sendCode (ctx: Context, next: NextHandler) {
  let filters = <FilterData.options[]> [
    {
      key: 'username',
      type: 'string'
    },
    {
      key: 'email',
      type: 'string',
      rules: [
        { required: true, message: '电子邮箱不能为空', code: 1000 }
      ]
    }
  ]
  try {
    let user = await ctx.getUser()
    if (user) {
      ctx.payload = user
    }
    else {
      let result = filterData(filters)(ctx.body)
      ctx.payload = cleanNaNByPayload(result)
    }
    return next()
  } catch (error) {
    if (error instanceof Error) {
      nextError(<HttpError>error, ctx, next)
    }
  }
}