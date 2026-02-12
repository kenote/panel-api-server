import ruleJudgment from 'rule-judgment'
import type { Context } from '@kenote/core'
import type { APIProxy } from '@/types/proxy'
import type { TcpSocketConnectOpts } from 'net'
import jsYaml from 'js-yaml'
import { parseTemplate } from './bcrypt'
import { resolve } from 'path'
import fs from 'fs'
import { get, set, omit, merge } from 'lodash'
import { sandboxBasicContext } from './sandbox'
import { asyncRequire } from '@kenote/config'

/**
 * 读取判断文件
 * @param channel 
 * @returns 
 */
export function readChannelFile (channel: string) {
  return (name: string, dir?: string) => {
    let pathname = resolve(process.cwd(), 'channels', channel, dir??'')
    let isConfFile = ruleJudgment({ $regex: new RegExp(`^(${name}\.(ya?ml|json5?|js))`) })
    if (!fs.existsSync(pathname)) return
    let filePath = resolve(pathname, fs.readdirSync(pathname)?.find(isConfFile)??'')
    if(!fs.statSync(filePath).isFile()) return
    return fs.readFileSync(filePath, 'utf8')
  }
}

/**
 * 解析配置
 * @param setting 
 * @param ctx 
 */
export function parseSetting (setting: APIProxy.ChannelSetting, ctx: Context) {
  let { channel } = ctx.params
  if (setting?.tcpSocket?.protobuf?.path) {
    setting.tcpSocket.protobuf.path = parseTemplate(setting.tcpSocket.protobuf.path, ctx.params)
  }
  let server = jsYaml.safeLoad(readChannelFile(channel)('server', 'data')??'')
  if (server) {
    if (setting?.tcpSocket) {
      setting.server = <(TcpSocketConnectOpts & { key: string })[]>server
      let { host, port } = setting.server.find(ruleJudgment({ key: 'slave' }))!
      if (host) {
        setting.tcpSocket.host = host
        setting.tcpSocket.port = port
      }
    }
  }
}

/**
 * 获取 service
 * @param service 
 * @param channel 
 * @returns 
 */
export function getChannelService (service: Record<string, unknown>, channel: string) {
  let utilFile = resolve(process.cwd(), 'channels', channel, 'js', 'util.js')
  if (fs.existsSync(utilFile)) {
    asyncRequire(utilFile, sandboxBasicContext)
    set(service, 'customize', merge(get(service, 'customize'), asyncRequire(utilFile, sandboxBasicContext)))
  }
  return omit(service, ['db', 'sms'])
}