import type { BaseInfo } from '.'
import { PutResult } from '@kenote/upload'

export declare interface StoreBaseInfo extends BaseInfo {
  userDir    ?: boolean
  thumbnail  ?: string
  permission ?: 'directory' | 'file' | false
}

export declare interface FileInfo extends Omit<PutResult, 'url'> {
  url        ?: string
  mime       ?: string
  mtime       : Date
  directory   : boolean
  thumbnail  ?: string
}