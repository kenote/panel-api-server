import session from '@kenote/koa-session'
import redisStore from 'koa-redis'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '@/types/config/server'
import { merge } from 'lodash'

const { SECRET_KEY, redisOpts } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })

export default session({
  key: SECRET_KEY,
  store: redisStore(merge({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_NAME,
    password: process.env.REDIS_PASS
  }, redisOpts))
})