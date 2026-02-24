import { loadConfig } from '@kenote/config'
import fs from 'fs'
import { resolve } from 'path'
import jsYaml from 'js-yaml'
import { last, merge } from 'lodash'

/**
 * 设置配置参数
 * @param name 
 * @param value 
 */
export function setConfig<T> (name: string, value: Partial<T>) {
  let rootDir = resolve(process.cwd(), 'config', name)
  let filename = last(fs.readdirSync(rootDir).filter( v => /(local|release)\.(json|ya?ml)$/.test(v) )) ?? 'config.release.yml'
  value = merge(loadConfig<T>(`config/${name}/${filename}`), value)
  if (/\.json/.test(filename)) {
    fs.writeFileSync(resolve(rootDir, filename), JSON.stringify(value, null, 2), 'utf8')
  }
  else {
    fs.writeFileSync(resolve(rootDir, filename), jsYaml.dump(value), 'utf8')
  }
}