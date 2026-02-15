
import * as uuid from 'uuid'
import { getProxyResponse } from './proxy'
import { resolve } from 'path'
import fs from 'fs'
import jsYaml from 'js-yaml'
import { json2Xlsx } from './xlsx'
import { getEnv } from '.'
import type { TaskOptions, TaskByUnzip, TaskNode, TaskByArchiver, TaskByAPIProxy } from '@/types/task'
import { archiveFile, unzipFile } from './unzip'
import { loadConfig } from '@kenote/config'
import { omit, isString } from 'lodash'
import dayjs from 'dayjs'

export const taskDir = resolve(process.cwd(), 'tasks')

/**
 * 创建任务
 * @param options 
 * @param payload 
 * @returns 
 */
export function createTask (options: TaskOptions, payload?: any) {
  let pid = uuid.v7()
  if (options.type === 'api-proxy') {
    createTaskByAPIProxy(pid, omit(options, ['type']), payload)
  }
  else if (options.type === 'archiver') {
    createTaskByArchiver(pid, omit(options, ['type']))
  }
  else if (options.type === 'unzip') {
    createTaskByUnzip(pid, omit(options, ['type']))
  }
  return { pid, type: options.type }
}

/**
 * 创建解压任务
 * @param pid 
 * @param options 
 */
export function createTaskByUnzip (pid: string, options: Omit<TaskByUnzip, 'type'>) {
  let tmpDir = resolve(taskDir, pid)
  fs.mkdirSync(tmpDir, { recursive: true })
  let { zipfile, output } = options
  let info = <TaskNode> {
    pid,
    type: 'unzip',
    uid: options.uid,
    data: omit(options, ['uid']),
    status: 'running',
    createTime: new Date()
  }
  fs.writeFileSync(resolve(tmpDir, 'setting.yml'), jsYaml.dump(info), 'utf8')
  unzipFile(zipfile, output, (error, result) => {
    if (error) {
      info.status = 'finish'
      info.error = error.message
      info.lastTime = new Date()
      tasklog(pid, info.createTime, 'error', error.message)
    }
    else if (result!.progress == 100) {
      info.status = 'finish'
      info.results = result
      info.lastTime = new Date()
      tasklog(pid, info.createTime, info.status, result)
    }
    else {
      info.status = 'running'
      info.results = result
      tasklog(pid, info.createTime, info.status, result)
    }
    fs.writeFileSync(resolve(tmpDir, 'setting.yml'), jsYaml.dump(info), 'utf8')
  })
}

/**
 * 创建归档任务
 * @param pid 
 * @param options 
 */
export function createTaskByArchiver (pid: string, options: Omit<TaskByArchiver, 'type'>) {
  let tmpDir = resolve(taskDir, pid)
  fs.mkdirSync(tmpDir, { recursive: true })
  let { filename, input } = options
  let info = <TaskNode> {
    pid,
    type: 'archiver',
    uid: options.uid,
    data: omit(options, ['uid']),
    status: 'running',
    createTime: new Date()
  }
  fs.writeFileSync(resolve(tmpDir, 'setting.yml'), jsYaml.dump(info), 'utf8')

  archiveFile(filename, input, (error, result) => {
    if (error) {
      info.status = 'finish'
      info.error = error.message
      info.lastTime = new Date()
      tasklog(pid, info.createTime, 'error', error.message)
    }
    else {
      info.status = result?.status!
      info.results = omit(result, ['status'])
      if (result?.status == 'finish') {
        info.lastTime = new Date()
      }
      tasklog(pid, info.createTime, info.status, omit(result, ['status']))

    }
    fs.writeFileSync(resolve(tmpDir, 'setting.yml'), jsYaml.dump(info), 'utf8')
  })
}

/**
 * 
 * @param pid 
 * @param options 
 * @param payload 
 */
export function createTaskByAPIProxy (pid: string, options: Omit<TaskByAPIProxy, 'type'>, payload: any) {
  let tmpDir = resolve(taskDir, pid)
  fs.mkdirSync(tmpDir, { recursive: true })
  let { entrance, proxy, output } = options
  let info = <TaskNode> {
    pid,
    type: 'api-proxy',
    uid: options.uid,
    data: {
      route: `${proxy.ctx.method} ${proxy.ctx.originalUrl}`,
      body: proxy.ctx.body,
      payload
    },
    status: 'running',
    createTime: new Date()
  }
  fs.writeFileSync(resolve(tmpDir, 'setting.yml'), jsYaml.dump(info), 'utf8')

  getProxyResponse(entrance, payload)(proxy)
    .then( ret => {
      let { result } = ret
      let name = dayjs().format('YYYYMMDDTHHmmss')
      if (output == 'xlsx') {
        json2Xlsx(result?.data, resolve(taskDir, pid, `${name}.xlsx`))
      }
      fs.writeFileSync(resolve(taskDir, pid, `${name}.json`), JSON.stringify(result, null, 2), 'utf8')
      info.status = 'finish'
      info.lastTime = new Date()
      info.results = { url: `${getEnv().SITE_HOST}/v1/task/${pid}/${name}.${output}` }
      tasklog(pid, info.createTime, info.status, info.results)
      fs.writeFileSync(resolve(tmpDir, 'setting.yml'), jsYaml.dump(info), 'utf8')
    })
    .catch( err => {
      info.status = 'finish'
      info.error = err?.message
      info.lastTime = new Date()
      tasklog(pid, info.createTime, 'error', err?.message)
      fs.writeFileSync(resolve(tmpDir, 'setting.yml'), jsYaml.dump(info), 'utf8')
    })
}

/**
 * 获取任务列表
 * @returns 
 */
export function getTaskList (uid?: string) {
  if (!fs.existsSync(taskDir)) {
    fs.mkdirSync(taskDir, { recursive: true })
  }
  let list = fs.readdirSync(taskDir).filter( v => fs.statSync(resolve(taskDir, v)).isDirectory() )
  let tasks: TaskNode[] = []
  for (let name of list) {
    tasks.push(loadConfig(resolve(taskDir, name, 'setting.yml')))
  }
  return uid ? tasks.filter( v => v.uid === uid ) : tasks
}

/**
 * 任务日志
 * @param pid 
 * @param status 
 * @param info 
 * @returns 
 */
function tasklog(pid: string, startTime: Date, status: 'error' | 'running' | 'finish', info: any) {
  let logfile = resolve(taskDir, pid, 'task.log')
  if (status === 'error') {
    fs.writeFileSync(logfile, `createTime: ${startTime}\n----------------------------------------------------------\nError: ${info}`, 'utf8')
    fs.appendFileSync(logfile, `\n----------------------------------------------------------\nlastTime: ${new Date()}\n`)
  }
  else {
    if (!fs.existsSync(logfile)) {
      fs.writeFileSync(logfile, `createTime: ${startTime}\n----------------------------------------------------------\n`, 'utf8')
    }
    if (fs.readFileSync(logfile, 'utf8').includes('lastTime')) return
    let meassge = isString(info) ? info : JSON.stringify(info)
    fs.appendFileSync(logfile, `${status} ${meassge}\n`)
    if (status === 'finish') {
      fs.appendFileSync(logfile, `----------------------------------------------------------\nlastTime: ${new Date()}\n`)
    }
  }
}