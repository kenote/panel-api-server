import type { IncomingHttpHeaders } from 'http'

/** Http 请求 */
export declare type HttpRequest = {
  method     : 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'upload' | 'UPLOAD' | 'download' | 'DOWNLOAD'
  url        : string
  headers   ?: IncomingHttpHeaders
  params    ?: NodeJS.Dict<any>
  body      ?: NodeJS.Dict<any>
}

/** Http 返回 */
export declare type HttpResponse<T = any> = {
  body        ?: T
  status       : number
  statusText  ?: string
}