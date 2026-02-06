import { Module, type Context } from '@kenote/core'
import session from '~/plugins/session'
import passport from '~/plugins/passport'
import logger from './services/logger'
import restful from './middlewares/restful'
import { resolve } from 'path'
import UCControl from './controller/uc'

export const staticDir =resolve(process.cwd(), 'static')
export const templateDir = resolve(process.cwd(), 'views')

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
  imports: [ StaticFile, TemplateView, UCControl ],
  plugins: [ session, passport ],
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