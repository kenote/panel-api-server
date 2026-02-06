import crypto from 'crypto'
import nunjucks from 'nunjucks'
import type { RandomOptions } from '@/types'
import { isNumber, merge } from 'lodash'

export const md5 = (text: string) => crypto.createHash('md5').update(text).digest('hex')
export const sha1 = (text: string) => crypto.createHash('sha1').update(text).digest('hex')

/**
 * 解析模版
 * @param tpl 
 * @param context 
 */
export function parseTemplate (tpl: string, context: object) {
  let env = new nunjucks.Environment(null, { autoescape: false })
  env.addFilter(md5.name, value => String(md5(value)))
  env.addFilter(sha1.name, value => String.raw`${sha1(value)}`)
  return env.renderString(tpl, context)
}

/**
 * 加密字符串
 * @param format 
 * @returns 
 */
export function encode (format: string = 'value | md5') {
  return (value: string, salt?: string) => {
    if (!/^(\{){2}|(\}){2}$/.test(format)) {
      format = `{{ ${format} }}`
    }
    salt = salt ?? Math.random().toString(36).substring(8)
    return {
      salt,
      encrypt: parseTemplate(format, { value, salt })
    }
  }
}

/**
 * 比较字符串
 * @param format 
 * @returns 
 */
export function compare (format?: string) {
  return (value: string, encrypt: string, salt: string) => {
    let password = encode(format)(value, salt)
    return password.encrypt === encrypt
  }
}

/**
 * 随机字符串
 * @param params 
 * @param value 
 * @returns 
 */
export function randomString (params?: Partial<RandomOptions> | number, value: string = '') {
  let options: RandomOptions = { length: 10 }
  if (isNumber(params)) {
    options.length = params
  }
  else {
    options = merge(options, params)
  }
  if (options.length > value.length) {
    let rand = Math.random().toString(36).substring(2)
    let rema = Math.random().toString(10).substring(8)
    let val: string[] = []
    for (let i:number = 0; i < rand.length; i++) {
      val[i] = Number(rema[i]) % 2 === 0 && options.capitalize ? rand[i].toLocaleUpperCase() : rand[i]
    }
    let attach = val.join('')
    return randomString(options, value + attach)
  }
  else if (options.symbol) {
    let symbol = ['!', '@', '#', '%', '&', '(', ')', '=', '.', '?']
    let len = Math.ceil(Math.random() * 3) + 1
    let valueArr = value.split('')
    for (let i:number = 0; i < len; i++) {
      valueArr.splice(Math.ceil(Math.random() * (options.length - 1)), 1, symbol[Math.ceil(Math.random() * 10)])
    }
    return valueArr.join('').slice(0, options.length)
  }
  else {
    return value.slice(0, options.length)
  }
}