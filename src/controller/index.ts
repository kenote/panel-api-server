import { Module } from '@kenote/core'
import StoreController from './store'
import ProxyController from './proxy'

@Module({
  path: '/',
  controller: [ StoreController, ProxyController ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class RootControl {}