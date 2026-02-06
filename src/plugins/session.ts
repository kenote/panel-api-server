import session from '@kenote/koa-session'
import redisStore from 'koa-redis'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '@/types/config/server'

const { SECRET_KEY, redisOpts } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })

export default session({
  key: SECRET_KEY,
  store: redisStore(redisOpts)
})