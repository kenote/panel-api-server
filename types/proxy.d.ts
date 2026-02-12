import type { Method, FilterQuery } from '@kenote/common'
import type { FilterData, ParseData } from 'parse-string'
import { BaseInfo } from './'
import { Socket } from './socket'
import { HttpRequest } from './http'
import type { Context } from '@kenote/core'
import { TCPSocket } from '@kenote/protobuf'

export declare namespace APIProxy {

  /** 入口选项 */
  type EntranceOptions<T> = {
    channel          : string
    pathLabel        : string
    getUser          : () => Promise<T> | T
    sandbox         ?: Record<string, unknown>
    customize       ?: Record<string, Function>
  }

  /** 入口配置 */
  interface Entrance extends BaseInfo {
    router           : Router[]
    authentication  ?: Authentication[]
    payload         ?: FilterData.options[]
    props           ?: Record<string, string>
    native          ?: boolean | 'json'
    httpProxy       ?: HttpRequest
    socketProxy     ?: Socket.Request
    service         ?: ServiceProxy
    parse           ?: ParseOptions
    parseField      ?: string
    channelPath     ?: string
    whitelist       ?: string[]
  }

  /** 路由配置 */
  type Router = {
    method    : Method
    path      : string
  }

  /** 鉴权配置 */
  type Authentication = {
    type      : 'apikey' | 'sign'
    user     ?: FilterQuery<any>
    sign     ?: SignOptions
  }

  /** 验签选项 */
  type SignOptions = {
    token   ?: string | TokenOptions[]
    md5      : string
    field   ?: string
    debug   ?: boolean
  }

  /** 密钥选项 */
  type TokenOptions = {
    key      : string
    name     : string
    tags     : string[]
  }

  /** 频道配置 */
  interface ChannelSetting extends Partial<Socket.Configure> {
    jsAlias      ?: Record<string, string>
    ignorePath   ?: Record<string, RegExp>
    signuserOpts ?: SignuserOptions
    whitelist    ?: string
  }

  /** 验签用户选项 */
  type SignuserOptions = {
    openapi      : SignAPI[]
    user         : SignUser[]
    timestamp   ?: TimestampOpts
  }

  /** 时间戳超时设置 */
  type TimestampOpts = {
    field       : string
    timeout    ?: number
  }

  /** 验签用户 */
  type SignUser = {
    id          : number | string
    name        : string
    token       : string
    optional   ?: Record<string, Array<string|number>>
    openapi    ?: string[]
  }

  /** 验签API */
  type SignAPI = {
    name       : string
    valid      : string
    fields     ?: FilterData.options[]
    props      ?: Record<string, string>
  }

  /** 模块选项 */
  type ModuleOptions = {
    cwd        ?: string
    alias      ?: Record<string, string>
    sandbox    ?: Record<string, unknown>
  }

  /** 数据解析选项 */
  type ParseOptions = {
    path           ?: string
    options        ?: ParseData.parse | ParseData.parse[]
    defaultValues  ?: any
    exec           ?: string
  }

  /** 内部服务代理 */
  type ServiceProxy = {
    name    : string
    args   ?: any[]
  }

  /** 代理层选项 */
  type ProxyOptions = {
    setting          ?: ChannelSetting
    serviceModules   ?: Record<string, any>
    logger           ?: TCPSocket.Logger
    ctx               : Context
  }
}