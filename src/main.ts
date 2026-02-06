import { createServer } from 'http'
import { ServerFactory } from '@kenote/core'
import { ServiceEngine } from '@kenote/koa'
import appModule from './app.module'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '@/types/config/server'
import logger from './services/logger'
import * as address from 'address'
import AppDataSource from './services/data'

const HOST = '127.0.0.1'
const PORT = process.env.SERVER_PORT || 4000
const { SECRET_KEY } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })

async function bootstarp() {
  await AppDataSource.initialize()
  try {
    logger.info("Data Source has been initialized!")
  } catch (error) {
    logger.info("Error during Data Source initialization", error)
  }
  
  let factory = await ServerFactory(new ServiceEngine({ keys: [ SECRET_KEY ]})).create(appModule)
  createServer(factory.server).listen(PORT, async () => {
    logger.info('Http Server Running to http://%s:%d', HOST, PORT)
    if (process.env.NODE_ENV === 'development') {
      logger.info('External Browsing to http://%s:%d', address.ip(), PORT)
    }
  })
  
}

bootstarp()