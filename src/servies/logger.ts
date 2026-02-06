import { resolve } from 'path'
import bytes from 'bytes'
import { configure, getLogger } from 'log4js'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '@/types/config'

const env = process.env.NODE_ENV ?? 'development'
const loggerDir = resolve(process.cwd(), 'logs')
const { SECRET_KEY } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })

configure({
  appenders: {
    out: { type: 'stdout' },
    app: {
      type: 'dateFile',
      filename: resolve(loggerDir, `${env}/bak`),
      pattern: 'yyyy-MM-dd-hh.log',
      alwaysIncludePattern: true
    },
    file: {
      type: 'file',
      filename: resolve(loggerDir, `${env}.log`),
      maxLogSize: bytes.parse('10MB')!,
      backups: 5,
      compress: true,
      encoding: 'utf-8',
      mode: 0o0640,
      flags: 'w+'
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'info'
    },
    cheese: {
      appenders: ['out', 'app', 'file'],
      level: 'all'
    },
    development: {
      appenders: ['out', 'app', 'file'],
      level: 'all'
    },
    production: {
      appenders: ['out', 'app', 'file'],
      level: 'all'
    }
  },
  pm2: true,
  pm2InstanceVar: SECRET_KEY,
  disableClustering: true
})

export default getLogger(env)