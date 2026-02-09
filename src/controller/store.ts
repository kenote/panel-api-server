import { type Context, Controller, type NextHandler, Post, Get } from '@kenote/core'
import { nextError, httpError, ErrorCode } from '~/services/error'
import type { HttpError } from 'http-errors'
import * as Store from '~/services/store'
import { keys } from 'lodash'
import { resolve } from 'path'
import sharp from 'sharp'
import * as mime from 'mime-types'

@Controller()
export default class StoreController {

  /**
   * 上传文件
   */
  @Post('/v1/upload/:type?')
  async upload (ctx: Context, next: NextHandler) {
    let { type } = ctx.params
    let { dir } = ctx.query
    try {
      let user = await ctx.getUser()
      if (!user) {
        return await ctx.status(401).send('Unauthorized')
      }
      let store = Store.store(type)(ctx.req)
      if (!store || store.type == 'noupload') {
        return await ctx.notfound()
      }
      let filePath = Store.getSavePath(type, dir, ctx.user)
      let putStream = Store.putStreams?.[store.type]
      if (!putStream) {
        throw httpError(ErrorCode.ERROR_MISSING_CONFIG_PARAMETER)
      }
      let result = await store.upload(putStream, httpError, filePath)
      if (result.length === 0) {
        throw httpError(ErrorCode.ERROR_UPLOAD_NOT_FILE)
      }
      return ctx.api(result.map(Store.parsePutResult(ctx)))
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == 'jwt expired') {
          return await ctx.status(401).send('Unauthorized')
        }
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /**
   * 下载文件
   */
  @Get('/files/:filename')
  @Get('/files/:type/:filename')
  async download (ctx: Context, next: NextHandler) {
    let { type, filename } = ctx.params
    let { dir } = ctx.query
    let { root_dir, permission } = Store.getOptions(type)
    let mode = <'preview' | 'download'> (keys(ctx.query).includes('download') ? 'download' : 'preview')
    try {
      if (permission == 'file') {
        let user = await ctx.getUser()
        if (!user) {
          return await ctx.status(401).send('Unauthorized')
        }
      }
      if (!root_dir) {
        return await ctx.notfound()
      }
      let rootDir = resolve(process.cwd(), root_dir, String(dir??'').replace(/^\//, ''))
      let filePath = resolve(rootDir, filename)
      return ctx.sendStream(filePath, { mode })
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

  /** 
   * 缩略图
   */
  @Get('/thumbnail/:filename')
  @Get('/thumbnail/:type/:filename')
  async thumbnail (ctx: Context, next: NextHandler) {
    let { type, filename } = ctx.params
    let { dir } = ctx.query
    try {
      let { root_dir } = Store.getOptions(type)
      if (!root_dir) {
        return await ctx.notfound()
      }
      let rootDir = resolve(process.cwd(), root_dir, String(dir??'').replace(/^\//, ''))
      let filePath = resolve(rootDir, filename)
      let buffer = await sharp(filePath).resize(200, 200).toBuffer()
      ctx.setHeader('Content-Type', mime.lookup(filename)||'application/octet-stream')
      return ctx.send(buffer)
    } catch (error) {
      if (error instanceof Error) {
        nextError(<HttpError>error, ctx, next)
      }
    }
  }

}