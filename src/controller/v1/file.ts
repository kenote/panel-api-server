import { type Context, Controller, type NextHandler, Get, Delete, Post } from '@kenote/core'
import { httpError, nextError, ErrorCode } from '~/services/error'
import type { HttpError } from 'http-errors'
import * as Store from '~/services/store'
import { isArray, zipObject } from 'lodash'
import { createTask } from '~/services/task'
import * as filter from '~/filters/file'
import { resolve } from 'path'
import fs from 'fs'
import type { TaskOptions } from '@/types/task'
import type { ArchiveNode } from '@/types'

@Controller('/file')
export default class FileController {

  /**
   * 文件列表
   */
  @Get('/:type?')
  async list (ctx: Context, next: NextHandler) {
    let { type } = ctx.params
    try {
      let store = Store.getOptions(type)
      if (store.permission == 'directory') {
        let user = await ctx.getUser()
        if (!user) {
          return await ctx.status(401).send('Unauthorized')
        }
      }
      let result = await Store.getFilelist(store, ctx.query.dir)
      return ctx.api(result)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /**
   * 删除文件
   */
  @Delete('/:type?')
  async remove (ctx: Context, next: NextHandler) {
    let { type } = ctx.params
    let { files } = ctx.body
    try {
      let user = await ctx.getUser()
      if (!user) {
        return await ctx.status(401).send('Unauthorized')
      }
      let store = Store.getOptions(type)
      await Store.removeFiles(store, isArray(files) ? files : String(files).split(/\,/), ctx.query.dir)
      return ctx.api({ result: true })
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /**
   * 解压ZIP文件
   */
  @Post('/unzip/:type?', { filters: [ filter.unzip ] })
  async unzip (ctx: Context, next: NextHandler) {
    let { type } = ctx.params
    try {
      let store = Store.getOptions(type)
      let rootDir = resolve(process.cwd(), store.root_dir!, String(ctx.query.dir??'').replace(/^\//, ''))
      let zipfile = resolve(rootDir, String(ctx.payload.zipfile).replace(/^\//, ''))
      let output = resolve(rootDir, String(ctx.payload.output??'').replace(/^\//, ''))
      if (!fs.existsSync(zipfile)) {
        throw httpError(ErrorCode.ERROR_FILENAME_NOTEXISTS)
      }
      let result = createTask({ type: 'unzip', zipfile, output, uid: ctx.payload.uid })
      return ctx.api(result)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /** 
   * 归档ZIP文件
   */
  @Post('/archiver/:type?', { filters: [ filter.archiver ]})
  async archiver (ctx: Context, next: NextHandler) {
    let { name, type, level, content } = ctx.payload
    try {
      let store = Store.getOptions(ctx.params?.type)
      let rootDir = resolve(process.cwd(), store.root_dir!, String(ctx.query.dir??'').replace(/^\//, ''))
      let options = <TaskOptions> {
        type: 'archiver',
        filename: resolve(rootDir, name),
        input: {
          type,
          gzip: type === 'tar',
          zlib: { level },
          content: (<string[]>content).filter(v => /^(directory|file|string)\s/.test(v)).map(v => toArchiverContent(v, rootDir))
        },
        uid: ctx.payload.uid
      }
      let result = createTask(options)
      return ctx.api(result)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }
}

/**
 * 转换归档条目
 * @param value 
 * @param root 
 * @returns 
 */
function toArchiverContent (value: string, root: string) {
  let values = value.match(/^(\S+)\s+(\S+)(\s+(.*))?/)?.slice(1).map(v => v?.replace(/^\s/, ''))
  let info = <ArchiveNode> zipObject(['type', 'name', 'content'], values??[])
  info.name = resolve(root, info.name?.replace(/^(\/)/, ''))
  return info
}
