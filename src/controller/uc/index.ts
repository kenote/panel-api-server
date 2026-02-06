import { Module } from '@kenote/core'
import AccountController from './account'

@Module({
  path: '/uc',
  controller: [ AccountController ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class UCControl {}