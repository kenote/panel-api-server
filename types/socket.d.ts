import { TcpSocketConnectOpts } from 'net'
import { TCPSocket } from '@kenote/protobuf'

export declare namespace Socket {
  /** Socket 配置 */
  type Configure = {
    tcpSocket    : TCPSocket.Configure
    server       : Array<TcpSocketConnectOpts & { key: string }>
    tag         ?: string
  }

  /** Socket 请求体 */
  type Request = {
    msgtype       : number
    requestType  ?: string
    responseType ?: string
    serverTag    ?: string | TCPSocket.Configure
  }
}