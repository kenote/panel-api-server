import unzipper from 'unzipper'
import fs from 'fs'
import { resolve, basename, extname } from 'path'
import iconv from 'iconv-lite'
import type { Callback } from 'ioredis'
import archiver from 'archiver'
import type { ProgressResult, ArchiveResult, ArchiveOptions } from '@/types'
import { pick, compact } from 'lodash'
import { httpError, ErrorCode } from '~/services/error'

/**
 * 归档文件
 * @param zipFilePath 
 * @param archiveContent 
 */
export function archiveFile (zipFilePath: string, options: ArchiveOptions, callback?: Callback<ArchiveResult>) {
  // 初始化archiver实例，使用ZIP压缩
  let zipOptions = <archiver.ArchiverOptions> pick(options, ['comment', 'forceZip64'])
  if (options.type === 'tar') {
    zipOptions.gzip = options.gzip
    zipOptions.gzipOptions = options.zlib
  }
  else {
    zipOptions.zlib = options.zlib
  }
  let archive = archiver(options.type, zipOptions)
  // 创建文件流写入ZIP文件
  zipFilePath = zipFilePath.replace(/(\.+)$/, '')
  if (!extname(zipFilePath)) {
    let ext = compact([options.type, options.type === 'tar' && options?.gzip?'gz':'']).join('.')
    zipFilePath += `.${ext}`
  }

  let output = fs.createWriteStream(zipFilePath)
  // 监听 archive 事件
  output.on('close', () => {
    callback?.(null, { type: 'file', name: basename(zipFilePath), status: 'finish' })
  })
  archive.on('error', error => {
    resultError<archiver.ArchiverError>(error, callback)
  })
  archive.on('entry', entry => {
    callback?.(null, { type: entry?.['type'], name: entry.name, status: 'running' })
  })
  // 将归档数据写入输入流中
  archive.pipe(output)
  // 添加文件夹到归档中
  for (let node of options.content) {
    if (node.type === 'directory') {
      archive.directory(node.name, false)
    }
    else if (node.type === 'file') {
      archive.file(node.name, { name: basename(node.name) })
    }
    else if (node.type === 'string') {
      archive.append(node.content??'', { name: node.name })
    }
  }
  // 完成归档
  archive.finalize()
}

/**
 * 解压文件
 * @param zipFilePath 
 * @param outputFolder 
 */
export async function unzipFile (zipFilePath: string, outputFolder: string, callback?: Callback<ProgressResult>) {
  // 获取解压文件大小
  let totalSize = await getUncompressedSize(zipFilePath)
  // 初始化解压文件大小
  let tmpSize = 0
  // 创建文件流
  fs.createReadStream(zipFilePath)
    .pipe(unzipper.Parse())
    .on('entry', async entry => {
      // 处理进程
      let fullpath = resolve(outputFolder, iconv.decode(entry.props.pathBuffer, 'gbk'))
      if (entry.type === 'Directory') {
        fs.mkdirSync(fullpath, { recursive: true })
        await entry.autodrain()
        callback?.(null, getProgressResult(tmpSize, totalSize!, entry.path))
      }
      else {
        entry.on('data', chunk => {
          tmpSize += chunk.length
          callback?.(null, getProgressResult(tmpSize, totalSize!, entry.path))
        })
        entry.pipe(fs.createWriteStream(fullpath))
      }
    })
    .on('finish', () => {
      callback?.(null, getProgressResult(tmpSize, totalSize!))
    })
    .on('error', error => {
      resultError(error, callback)
    })
}

/**
 * 解压后的实际大小
 * @param zipFilePath 
 * @returns 
 */
async function getUncompressedSize (zipFilePath: string) {
  try {
    let directory = await unzipper.Open.file(zipFilePath)
    let totalSize = 0
    for (let entry of directory.files) {
      totalSize += entry.uncompressedSize
    }
    return totalSize
  } catch (error) {
    throw httpError(ErrorCode.ERROR_NOT_ZIPFILE)
  }
  
}

/**
 * 获取进度信息
 * @param current 
 * @param total 
 * @returns 
 */
function getProgressResult(current: number, total: number, path?: string) {
  return <ProgressResult> {
    current,
    total,
    progress: current/total*100,
    path
  }
}

/**
 * 回调错误信息
 * @param error 
 * @param callback 
 */
function resultError<T extends Error> (error: T, callback?: Callback) {
  if (callback) {
    callback(error)
  }
  else {
    throw error
  }
}