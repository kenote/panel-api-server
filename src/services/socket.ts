import net from 'net'
import { TCPSocket as ITCPSocket, Protobuf, ExBuffer } from '@kenote/protobuf'
import type { Socket } from '@/types/socket'
import ruleJudgment from 'rule-judgment'
import { first, toPlainObject, merge } from 'lodash'
import { httpError, ErrorCode } from '~/services/error'

/**
 * 发送 Socket 请求
 * @param msgtype 
 * @param payload 
 * @param requestType 
 * @returns 
 */
export function socketRequest<T> (msgtype: number, payload: Record<string, any>, requestType?: string) {
  return async (options: Socket.Configure) => {
    let { tcpSocket, server, tag } = options
    let client = new TCPSocket(tcpSocket)
    if (tag) {
      let connect = server.find( ruleJudgment({ key: tag }) )
      if (connect) {
        client.connect(connect)
      }
    }
    else if (!tcpSocket.host) {
      let connect = first(server)
      if (connect) {
        client.connect(connect)
      }
    }
    tcpSocket.logger?.info(payload)
    let result = await client.encode(msgtype, payload, requestType!).send<T>(true)
    tcpSocket.logger?.info(result)
    return toPlainObject(result)
  }
}

/**
 * Socket 模型
 */
class TCPSocket {

  private __Options: ITCPSocket.Configure
  private __Client: net.Socket | null
  private __ExBuffer: ExBuffer | null
  private __DataBuffer: Buffer | null
  private __Protobuf: Protobuf

  constructor (options: ITCPSocket.Configure) {
    this.__Options = options
    if (options.protobuf) {
      this.__Protobuf = new Protobuf(options?.protobuf)
    }
  }

  /**
   * 编码数据
   * @param msgtype 
   * @param params 
   * @param requestType 
   * @returns 
   */
  encode (msgtype: number, params: Record<string, any>, requestType?: string) {
    if (this.__Protobuf) {
      this.__DataBuffer = this.__Protobuf.encode(msgtype, params, requestType!)
    }
    return this
  }

  /**
   * 连接服务器
   * @returns 
   */
  connect (options?: net.TcpSocketConnectOpts) {
    let logger = this.__Options.logger
    let { host, port } = merge(this.__Options, options)
    if (this.__Client) {
      this.__Client.destroy()
      this.__Client = null
      this.__ExBuffer = null
    }
    let client = new net.Socket()
    client.setTimeout(50000)
    client.connect({ host, port }, () => {
      logger?.info('连接到', host, port)
    })
    this.__Client = client
    return this
  }

  /**
   * 发送消息
   * @param data 
   * @returns 
   */
  send <T> (data?: Uint8Array | string | true) {
    if (!this.__Client || this.__Client.destroyed) {
      this.connect()
    }
    let client = this.__Client
    this.__ExBuffer = new ExBuffer().uint32Head().bigEndian()
    // 发送数据
    client?.write(this.__DataBuffer! ?? data)
    // 开始接收数据，并进行粘包
    client?.on('data', buffer => this.__ExBuffer?.put(buffer))
    if (this.__DataBuffer) {
      this.__DataBuffer = null
      if (data === true) {
        return this.exec<T>()
      }
    }
    return this
  }

  /**
   * 监听事件
   * @param event
   * @param listener 
   * @returns 
   */
  on (event: 'data' | 'error' | 'timeout' | 'close', listener: (...args: any[]) => void) {
    if (!this.__Client) return
    let client = this.__Client
    if (event === 'data') {
      this.__ExBuffer?.on('data', listener)
    }
    else {
      client.on(event, listener)
    }
  }

  /**
   * 监听事件(仅一次)
   * @param event
   * @param listener 
   * @returns 
   */
  once (event: 'data' | 'error' | 'timeout' | 'close', listener: (...args: any[]) => void) {
    if (!this.__Client) return
    let client = this.__Client
    if (event === 'data') {
      this.__ExBuffer?.once('data', listener)
    }
    else {
      client.once(event, listener)
    }
  }

  /**
   * 立即返回结果
   * @returns 
   */
  async exec<T = any> () {
    let { logger } = this.__Options
    return new Promise((resolve, reject) => {
      this.on('data', buffer => {
        if (buffer.length > 0) {
          try {
            if (this.__Protobuf) {
              resolve(this.__Protobuf.decode(buffer) as unknown as T)
            }
            else {
              resolve(buffer)
            }
          } catch (error) {
            reject(error)
          }
          this.destroy()
        }
      })
      // 监听错误
      this.on('error', error => reject(error) )
      // 监听关闭连接
      this.on('close', () => {
        logger?.info('Socket is closed.')
      })
      // 监听超时
      this.on('timeout', () => {
        logger?.error('Socket is timout.')
        this.destroy()
        reject(httpError(ErrorCode.ERROR_SOCKET_CONNECT_TIMEOUT))
      })
    })
  }

  /**
   * 关闭/销毁客户端连接
   * @param error 
   */
  destroy () {
    this.__Client?.destroy()
  }
}