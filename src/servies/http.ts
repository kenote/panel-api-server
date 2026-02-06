import axios from 'axios'
import { HttpClient } from '@kenote/common'
import { HttpRequest, HttpResponse } from '@/types/http'
import qs from 'query-string'
import { merge } from 'lodash'

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
  try {
    let result = await client?.[method]<T>?.(url, body)
    return <HttpResponse<T>> { body: result, status: 200 }
  } catch (error) {
    return <HttpResponse<T>> { status: error.status, statusText: error.message }
  }
}