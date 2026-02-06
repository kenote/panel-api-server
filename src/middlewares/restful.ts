import { Action, type Context, Middleware, Property } from '@kenote/core'
import type { HttpError } from 'http-errors'
import type { Restful } from '@/types/restful'

@Middleware()
export default class restful {

  @Action()
  api<T =any> (ctx:Context) {
    return (data: T, error?: HttpError) => {
      if (error != null) {
        ctx.json({ error: error?.message })
      }
      else {
        ctx.json({ data })
      }
    }
  }
}

declare module '@kenote/core' {
  interface Context extends Restful {
    
  }
}