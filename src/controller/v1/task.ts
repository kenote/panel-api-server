import { type Context, Controller, type NextHandler, Get, Delete, Put } from '@kenote/core'
import { httpError, nextError, ErrorCode } from '~/services/error'
import type { HttpError } from 'http-errors'
import { taskDir, getTaskList } from '~/services/task'
import { resolve } from 'path'
import fs from 'fs'
import { isArray, last } from 'lodash'
import { loadConfig } from '@kenote/config'
import type { AccountConfigure } from '@/types/config/account'

@Controller('/task')
export default class TaskController {

  /**
   * 获取任务列表/文件/日志
   */
  @Get('/:pid?/:file?')
  async file (ctx: Context, next: NextHandler) {
    let { pid, file } = ctx.params
    try {
      if (file) {
        let filename = resolve(taskDir, pid, file == 'log' ? 'task.log' : file)
        return ctx.sendStream(filename, { mode: 'preview' })
      }
      else {
        let user = await ctx.getUser()
        if (!user) {
          return await ctx.status(401).send('Unauthorized')
        }
        let { admins } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
        let result = getTaskList(admins?.includes(user.username) ? undefined : user.pid)
        if (pid) {
          return ctx.api(result.find( v => v.pid === pid))
        }
        return ctx.api(result)
      }
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /**
   * 删除任务
   */
  @Delete('/:pid?')
  async remove (ctx: Context, next: NextHandler) {
    let { pid } = ctx.params
    try {
      let user = await ctx.getUser()
      if (!user) {
        return await ctx.status(401).send('Unauthorized')
      }
      let { admins } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
      let result = getTaskList(admins?.includes(user.username) ? undefined : user.pid)
      if (pid) {
        if (result.find( v => v.pid === pid )) {
          fs.rmSync(resolve(taskDir, pid), { recursive: true, force: true })
        }
      }
      else {
        let list: string[] = isArray(ctx.body.pids) ? ctx.body.pids : String(ctx.body.pids).split(/\,/)
        for (let item of result.filter( v => list.includes(v.pid))) {
          fs.rmSync(resolve(taskDir, item.pid), { recursive: true, force: true })
        }
      }
      return ctx.api({ result: true })
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /**
   * 查询任务进度结果
   */
  @Put('/result/:pid?')
  async result (ctx: Context, next: NextHandler) {
    let pid = ctx.body?.pid ?? ctx.params?.pid
    try {
      let user = await ctx.getUser()
      if (!user) {
        return await ctx.status(401).send('Unauthorized')
      }
      if (!pid) {
        throw httpError(ErrorCode.ERROR_VALID_DATE_REQUIRED, ['PID'])
      }
      let { admins } = loadConfig<AccountConfigure>('config/account', { mode: 'merge' })
      let task = getTaskList(admins?.includes(user.username) ? undefined : user.pid).find(v => v.pid === pid)
      if (!task) {
        throw httpError(ErrorCode.ERROR_CUSTOMIZE_DATA, ['未知任务PID'])
      }
      let logfile = resolve(taskDir, task?.pid, 'task.log')
      if (!fs.existsSync(logfile)) {
        throw httpError(ErrorCode.ERROR_FILENAME_NOTEXISTS)
      }
      let [ status, json ] = last(fs.readFileSync(logfile, 'utf8').split(/\n/).filter( v => /^(running|finish)/.test(v)))?.split(/\s+/)??[]
      let result = JSON.parse(json)
      if (!result.status) {
        result.status = status
      }
      return ctx.api(result)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }
}