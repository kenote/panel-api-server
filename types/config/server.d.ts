import { DataSourceOptions } from 'typeorm'
import { RedisOptions } from 'ioredis'
import { StringValue } from 'ms'

/** 服务配置 */
export declare type ServerConfigure = {
  SITE_NAME      ?: string
  SITE_HOST      ?: string
  SECRET_KEY      : string
  dataOptios      : DataSourceOptions
  redisOpts      ?: RedisOptions
  previewTypes   ?: ServerConfigure.FileType[]
  REFRESH_SECRET  : string
  expiresIn      ?: StringValue | number
  refreshExpires ?: StringValue | number
}

export declare namespace ServerConfigure {
  /** 文件类型 */
  interface FileType {
    type         : string
    extname      : string[]
  }
}