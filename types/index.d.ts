import unzipper from 'unzipper'
import { ZlibOptions } from 'zlib'

/** 基础信息 */
export declare type BaseInfo = {
  name         : string
  description ?: string
}

/** 随机字符串选项 */
export declare type RandomOptions = {
  length       : number
  symbol      ?: true
  capitalize  ?: true
}

/** 进度回调信息 */
export declare type ProgressResult = {
  progress : number
  total    : number
  current  : number
}

/** 归档回调信息 */
export declare interface ArchiveResult extends ArchiveNode {
  status     : 'running' | 'finish'
}

/** 归档节点信息 */
export declare type ArchiveNode = {
  type       : 'directory' | 'file' | 'string'
  name       : string
  content   ?: string
}

/** 归档选项 */
export declare type ArchiveOptions = {
  type            : 'zip' | 'tar'
  comment        ?: string         // 为 ZIP 文件添加注释
  forceZip64     ?: boolean        // 强制使用 ZIP64 格式，用于超过 4GB 的大文件
  gzip           ?: boolean        // 启用 GZIP
  zlib           ?: ZlibOptions    // zlib 选项
  content         : ArchiveNode[]  // 归档数据
}
