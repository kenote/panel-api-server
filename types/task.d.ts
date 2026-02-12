import { ArchiveOptions, ProgressResult, ArchiveNode } from '.'
import { APIProxy } from './proxy'

export declare type TaskOptions = TaskByUnzip | TaskByArchiver | TaskByAPIProxy

export declare type TaskByUnzip = {
  type       : 'unzip'
  zipfile    : string
  output     : string
}

export declare type TaskByArchiver = {
  type       : 'archiver'
  filename   : string
  input      : ArchiveOptions
}

export declare type TaskByAPIProxy = {
  type       : 'api-proxy'
  entrance  ?: APIProxy.Entrance
  proxy      : APIProxy.ProxyOptions
  output    ?: 'json' | 'xlsx'
}

export declare type TaskNode = {
  pid        : string
  type       : 'unzip' | 'archiver' | 'api-proxy'
  status     : 'running' | 'finish'
  error     ?: string
  createTime : Date
  lastTime  ?: Date
  results   ?: { url ?: string } | ArchiveNode | ProgressResult
  data      ?: Omit<TaskByUnzip, 'type>'> | Omit<TaskByArchiver, 'type>'> | { route: string, body: any, payload: any }
}