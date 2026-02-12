import { type Context, Controller, type NextHandler, Get, Post, Put, Delete } from '@kenote/core'
import { nextError } from '~/services/error'
import type { HttpError } from 'http-errors'
import { getEntrance, getProxyResponse } from '~/services/proxy'
import type { APIProxy } from '@/types/proxy'
import { resolve } from 'path'
import logger from '~/services/logger'
import { parseSetting, getChannelService } from '~/services/channel'
import * as service from '~/services'
import { createTask } from '~/services/task'

@Controller('/v2')
export default class ProxyController {

  @Get('/:channel/:label?/:tag?')
  @Post('/:channel/:label?/:tag?')
  @Put('/:channel/:label?/:tag?')
  @Delete('/:channel/:label?/:tag?')
  async handler (ctx: Context, next: NextHandler) {
    let { channel, label } = ctx.params
    let options = <APIProxy.EntranceOptions<any>> {
      channel,
      pathLabel: label,
      getUser: ctx.getUser,
      sandbox: {
        __dirname: resolve(process.cwd(), 'channels', channel),
        logger,
        service: getChannelService(service, channel)
      }
    }
    try {
      let { notFound, authenticationState, isUser, entrance, payload, serviceModules, setting } = await getEntrance(options)(ctx, 'channels')
      if (notFound) return ctx.notfound()
      if (authenticationState?.type === 'apikey' && isUser === 'Unauthorized') {
        return await ctx.status(401).send('Unauthorized')
      }

      parseSetting(setting!, ctx)
      // ?callback=task&output=xlsx
      if (ctx.query?.callback == 'task') {
        // 创建任务
        let { output } = ctx.query
        let result = createTask({ type: 'api-proxy', entrance, proxy: { ctx, logger, setting, serviceModules }, output }, payload)
        return ctx.api(result)
      }
      
      let { type, result } = await getProxyResponse(entrance, payload)({ ctx, logger, setting, serviceModules })
      if (entrance?.native) {
        ctx.setHeader('content-type', entrance.native == 'json' ? 'application/json; charset=utf-8' : type)
        return ctx.send(result)
      }
      return ctx.api(result)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == 'jwt expired') {
          return await ctx.status(401).send('Unauthorized')
        }
        nextError(<HttpError>error, ctx, next)
      }
    }
  }
}