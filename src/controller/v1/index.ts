import { Module } from '@kenote/core'
import FileController from './file'
import MailController from './mail'
import TaskController from './task'

@Module({
  path: '/v1',
  controller: [ FileController, MailController, TaskController ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class V1Control {}