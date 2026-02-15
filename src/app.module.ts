import { Module, type Context } from '@kenote/core'
import session from '~/plugins/session'
import passport from '~/plugins/passport'
import logger from './services/logger'
import restful from './middlewares/restful'
import { resolve } from 'path'
import RootControl from './controller'
import UCControl from './controller/uc'
import V1Control from './controller/v1'
import { toRequestHandler, Context as IContext } from '@kenote/koa'
import { pick } from 'lodash'

export const staticDir =resolve(process.cwd(), 'static')
export const templateDir = resolve(process.cwd(), 'views')

const getRequest = (ctx: IContext) => pick(ctx, [
  'headers', 'clientIP', 'method', 'originalUrl', 'params', 'path', 'body', 'protocol', 'query'
])

@Module({
  statics: {
    '/': staticDir
  },
  options: {
    dynamic: true
  }
})
class StaticFile {}

@Module({ 
  viewDir: templateDir, 
  engine: 'nunjucks', 
  extension: 'njk' 
})
class TemplateView {}

@Module({
  imports: [ StaticFile, TemplateView, RootControl, UCControl, V1Control ],
  plugins: [ session, passport, [
    toRequestHandler((ctx, next) => {
      logger.info('REQUEST', getRequest(ctx))
      return next()
    })
  ] ],
  middlewares: [ restful ],
  httpException: {
    notFound: async (ctx: Context) => {
      return await ctx.status(404).render('error', {
        code: 404,
        message: `This page could not be found.`
      })
    },
    exception: (Error, ctx: Context) => {
      logger.error({
        address: ctx.clientIP,
        request: {
          originalUrl: ctx.originalUrl,
          method: ctx.method,
          headers: ctx.headers,
          body: ctx.body
        },
        Error
      })
      ctx.renderException('error', {
        code: 500,
        message: `This page could internal server error`
      })
    }
  }
})
export default class AppModule {}