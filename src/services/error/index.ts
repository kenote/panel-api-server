import createError, { type HttpError } from 'http-errors'
import type { Context, NextHandler } from '@kenote/core'
import * as Code from './code'
import * as Message from './message'
import { format } from 'util'

export const SYSTEM_MINSAFE_ERROR_CODE = Number(process.env.SYSTEM_MINSAFE_ERROR_CODE ?? 1000)

export function nextError (error: HttpError, ctx: Context, next: NextHandler) {
  if (error.code >= SYSTEM_MINSAFE_ERROR_CODE) {
    ctx.api(null, error)
  }
  else {
    return next(error)
  }
}

export function httpError (code: number, opts?: Array<string | number | null>) {
  let message: string = ''
  for (let [key, val] of Object.entries(Code)) {
    if (code === val) {
      message = Message?.[key]
      break
    }
  }
  message = format(message, ...[...opts??[]])
  return createError(500, message, { code })
}

export const ErrorCode = Code
export const ErrorMessage = Message