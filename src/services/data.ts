import { DataSource, DataSourceOptions, Logger, QueryRunner } from 'typeorm'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '@/types/config'
import { merge } from 'lodash'
import * as entities from '~/entities'
import logger from './logger'

const { dataOptios } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })

class MyCustomLogger implements Logger {
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        logger.info(`${query} -- Parameters: ${JSON.stringify(parameters)}`);
    }
    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        logger.error(`${error} -- ${query} -- Parameters: ${JSON.stringify(parameters)}`);
    }
    // 实现其他必要方法...
    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {}
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {}
    logSchemaBuild(message: string, queryRunner?: QueryRunner) {}
    logMigration(message: string, queryRunner?: QueryRunner) {}
}

const AppDataSource = new DataSource(merge(<DataSourceOptions>{
  type: process.env.DB_TYPE,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS
}, dataOptios, <Partial<DataSourceOptions>>{
  entities,
  synchronize: true,
  logging: process.env.NODE_ENV === 'production' ? ['error'] : true,
  logger: new MyCustomLogger()
}))

export default AppDataSource