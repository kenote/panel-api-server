import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '@/types/config'

export function getEnv () {
  let { SITE_NAME, SITE_HOST } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })
  return {
    SITE_NAME: SITE_NAME ?? process.env.SITE_NAME,
    SITE_HOST: SITE_HOST ?? process.env.SITE_HOST
  }
}