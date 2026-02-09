import { Module } from '@kenote/core'
import FileController from './file'

@Module({
  path: '/v1',
  controller: [ FileController ],
  options: {
    cors: true,
    headers: {}
  }
})
export default class V1Control {}