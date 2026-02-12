import { type Context, Controller, type NextHandler, Get } from '@kenote/core'
import { nextError } from '~/services/error'
import type { HttpError } from 'http-errors'
import { taskDir, getTaskList } from '~/services/task'
import { resolve } from 'path'

@Controller('/task')
export default class TaskController {

  @Get('/:pid?/:file?')
  async file (ctx: Context, next: NextHandler) {
    let { pid, file } = ctx.params
    try {
      if (file) {
        let filename = resolve(taskDir, pid, file == 'log' ? 'task.log' : file)
        return ctx.sendStream(filename, { mode: 'preview' })
      }
      else {
        let result = getTaskList()
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
}