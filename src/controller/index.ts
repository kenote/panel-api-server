import { Module } from '@kenote/core'
import StoreController from './store'

@Module({
  path: '/',
  controller: [ StoreController ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class RootControl {}