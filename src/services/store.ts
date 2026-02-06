
import { loadConfig } from '@kenote/config'
import { uploadStore, type UploadStoreOptions, type PutResult, type PutStreamFunction, putStream } from '@kenote/upload'
import { ErrorCode } from './error'
import type { IncomingMessage } from 'http'
import type { SafeUser } from '@/types/db/user'
import { compact, isArray } from 'lodash'
import type { StreamOptions } from '@/types/restful'
import type { ServerConfigure } from '@/types/config'
import path from 'path'
import ruleJudgment from 'rule-judgment'
import type { Context } from '@kenote/core'
import fs from 'fs'
import * as mime from 'mime-types'
import { getEnv } from './'
import type { StoreBaseInfo, FileInfo }  from '@/types/store'

const storeErrors: Record<'limit' | 'mimetype', number> = {
  limit: ErrorCode.ERROR_UPLOAD_FILESIZE_LARGEMAX,
  mimetype: ErrorCode.ERROR_UPLOAD_FILE_MIMETYPE
}

/**
 * 获取相关配置
 * @param name 
 * @returns 
 */
export const getOptions = (name: string = 'default') => {
  let stores = loadConfig<Record<string, UploadStoreOptions<StoreBaseInfo>>>('config/store', { mode: 'merge' })
  for (let [key] of Object.entries(stores)) {
    stores[key].errors = storeErrors
  }
  return stores?.[name]
}

/**
 * 获取存储器
 * @param name 
 * @returns 
 */
export const store = (name: string) => (req: IncomingMessage) => {
  let options = getOptions(name)
  if (!options) return 
  return uploadStore(options, req)
}

/**
 * 获取文件存储路径
 * @param type 
 * @param dir 
 * @param user 
 * @returns 
 */
export function getSavePath (type: string, dir: string | string[], user: SafeUser) {
  let filePath = (isArray(dir) ? dir?.[0] : dir) ?? ''
  let { userDir } = getOptions(type)
  if (userDir) {
    let dirArr = compact([ filePath ])
    dirArr.push(user.pid)
    filePath = dirArr.join('/')
  }
  return filePath
}

/**
 * 获取文件流类型
 * @param filename 
 * @param options 
 * @returns 
 */
export function getContentType (filename: string, options: StreamOptions) {
  let contentType = options.contentType
  let { previewTypes } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })
  if (options.mode === 'preview') {
    let extname = path.extname(filename)
    let filter = ruleJudgment<ServerConfigure.FileType>({ extname: { $_in: [extname] } })
    contentType = previewTypes?.find(filter)?.type ?? contentType
  }
  return contentType ?? 'application/octet-stream'
}

/**
 * 获取回调结果
 * @param ctx 
 * @returns 
 */
export function parsePutResult (ctx: Context) {
  return (result: PutResult) => {
    let { url } = result
    if (/^(\/)/.test(result.url)) {
      result.url = `${ctx.protocol}://${ctx.headers.host}${url}`
    }
    return result
  }
}

/**
 * 文件上传流
 */
export const putStreams: Record<string, PutStreamFunction> = {
  'local': putStream
}

/**
 * 获取文件列表
 * @param options 
 * @param directory 
 * @returns 
 */
export async function getFilelist (options: UploadStoreOptions<StoreBaseInfo>, directory?: string) {
  let { root_dir, type, urlprefix, thumbnail } = options
  if (['local', 'noupload'].includes(type!)) {
    let rootDir = path.resolve(process.cwd(), root_dir!, String(directory??'').replace(/^\//, ''))
    let files = fs.readdirSync(rootDir).map( name => {
      let filePath = path.resolve(rootDir, name)
      let stats = fs.statSync(filePath)
      let info: FileInfo = {
        name,
        size: stats.isFile() ? stats.size : NaN,
        mtime: stats.mtime,
        directory: stats.isDirectory()
      }
      if (!info.directory) {
        info.url = `${getEnv().SITE_HOST}${urlprefix}/${name}${directory?`?dir=${directory}`:''}`
        info.mime = mime.lookup(name)||'application/octet-stream'
        if (/^(image)/.test(info.mime!)) {
          info.thumbnail = `${getEnv().SITE_HOST}${thumbnail}/${name}${directory?`?dir=${directory}`:''}`
        }
      }
      return info
    })
    return files
  }
}

/**
 * 删除文件
 * @param options 
 * @param files 
 * @param directory 
 */
export async function removeFiles(options: UploadStoreOptions, files: string[], directory?: string) {
  let { root_dir, type } = options
  if (type == 'local') {
    let rootDir = path.resolve(process.cwd(), root_dir!, String(directory??'').replace(/^\//, ''))
    for (let file of files) {
      if (!fs.existsSync(path.resolve(rootDir, file))) continue
      fs.rmSync(path.resolve(rootDir, file), { recursive: true, force: true })
    }
  }
}