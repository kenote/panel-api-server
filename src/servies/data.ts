import { DataSource, DataSourceOptions } from 'typeorm'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '@/types/config'
import { merge } from 'lodash'
import * as entities from '~/entities'

const { dataOptios } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })

const AppDataSource = new DataSource(merge(dataOptios, <Partial<DataSourceOptions>>{
  entities,
  synchronize: true,
  logging: true,
  logger: 'file'
}))

export default AppDataSource