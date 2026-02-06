import { HttpError } from 'http-errors'

export declare interface Restful {

  api<t = any> (data: t, error?: HttpError): void
  
}