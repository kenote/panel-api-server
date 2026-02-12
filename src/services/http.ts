import axios from 'axios'
import type { RequestConfig, ClientInstance, Method, HeaderOptions, ProgressResult, HttpResponse } from '@kenote/common'
import type { HttpRequest } from '@/types/http'
import qs from 'query-string'
import { merge, omit } from 'lodash'
import urlParse from 'url-parse'

/**
 * 发送Http请求
 * @param request 
 * @returns 
 */
export async function sendHttp<T = any> (request: HttpRequest) {
  let { headers, method, params, body } = request
  let client = new HttpClient(axios, { headers })
  let { query } = qs.parseUrl(request.url)
  let url = qs.stringifyUrl({ url: request.url, query: merge(query, params) })
  let result = await client?.[method]<T>?.(url, body)
  return result
}

/**
 * 设置 Headers
 * @param options 
 * @returns 
 */
function setHeader<T extends HeaderOptions> (options?: T) {
  let headers = options?.headers ?? {}
  if (options?.token) {
    headers.authorization = ['Bearer', options.token].join(' ')
  }
  return headers
}

/**
 * 监听进度
 * @param next 
 * @param total 
 * @returns 
 */
function onProgress (next: ProgressResult, total?: number) {
  return (progressEvent: ProgressEvent) => {
    let __total = total ?? progressEvent.total
    let percentage = Math.round((progressEvent.loaded * 100) / __total)
    if (percentage <= 100) {
      next({
        percentage,
        total: __total,
        size: progressEvent.loaded
      })
    } 
  }
}

/**
 * 获取返回数据
 * @param options 
 * @param next 
 * @returns 
 */
function getResponseData<T = any> (options: RequestConfig, next?: (response: HttpResponse<T>) => void) {
  return async (client: ClientInstance) => {
    let response = await client(options)
    next && next(response)
    if (!response) return null
    if (response.status >= 200 && response.status < 300) {
      return <HttpResponse<T>> omit(response, ['config', 'request'])
    }
    throw new Error(response.statusText)
  }
}

/**
 * 发送数据
 * @param method 
 * @param url 
 * @param data 
 * @returns 
 */
function sendData<T = any> (method: Method, url: string, data: any) {
  return (client: ClientInstance, options?: HeaderOptions) => {
    let config: RequestConfig = merge({
      method,
      url,
      headers: setHeader(options),
      timeout: options?.timeout,
      baseURL: options?.baseURL
    }, options?.config)
    if (options?.download) {
      config.responseType = options.responseType ?? 'blob'
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.onDownloadProgress = onProgress(options.download, options.total)
    }
    if (options?.upload) {
      config.method = 'post'
      config.headers['Content-Type'] = 'multipart/form-data'
      config.onUploadProgress = onProgress(options.upload, options.total)
    }
    if (method.toLocaleLowerCase() === 'get') {
      let { query } = urlParse(config.url)
      config.params = { ...qs.parse(query as unknown as string), ...data }
    }
    else {
      config.data = data
    }
    return getResponseData<T>(config, options?.success)(client)
  }
}

/**
 * 定义模型
 */
class HttpClient {

  private __client!: ClientInstance
  private __options!: HeaderOptions

  constructor (client: ClientInstance, options?: HeaderOptions) {
    this.__client = client
    this.__options = options ?? {}
  }

  get = <T = any>(url: string, data?: any) => sendData<T>('GET', url, data)(this.__client, this.__options)
  GET = this.get

  post = <T = any>(url: string, data?: any) => sendData<T>('POST', url, data)(this.__client, this.__options)
  POST = this.post

  put = <T = any>(url: string, data?: any) => sendData<T>('PUT', url, data)(this.__client, this.__options)
  PUT = this.put

  delete = <T = any>(url: string, data?: any) => sendData<T>('DELETE', url, data)(this.__client, this.__options)
  DELETE = this.delete

  download = <T = any>(url: string) => sendData<T>('GET', url, null)(this.__client, { download: info => null, ...this.__options })
  DOWNLOAD = this.download

  upload = <T = any>(url: string, data: any) => sendData<T>('POST', url, data)(this.__client, { upload: info => null, ...this.__options })
  UPLOAD = this.upload
}