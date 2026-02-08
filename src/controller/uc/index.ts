import { Module } from '@kenote/core'
import AccountController from './account'
import TokenController from './token'

@Module({
  path: '/uc',
  controller: [ AccountController, TokenController ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class UCControl {}