import { Module } from '@kenote/core'
import FileController from './file'
import MailController from './mail'

@Module({
  path: '/v1',
  controller: [ FileController, MailController ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class V1Control {}