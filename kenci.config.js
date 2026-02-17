// kenci.config.js
require('dotenv').config()
const { merge } = require('lodash')

module.exports = {
  /**
   * 入口文件
   */
  entry: 'main.ts',
  /**
   * 源码目录
   */
  srcDir: 'src/',
  /**
   * Ts 配置文件名；默认 tsconfig.json
   */
  tsconfig: '../tsconfig.json',
  /**
   * 编译选项
   */
  build: {
    /**
     * 输出目录
     */
    outDir: 'dist',
    /**
     * 编译时是否清理输出目录
     */
    emptyOutDir: true
  },
  /**
   * 开发选项
   */
  develop: {
    /**
     * 默认端口; 
     */
    port: 4000,
    /**
     * 需要监听的文件； 默认监听源码目录
     */
    watch: [ 'src/' ],
    /**
     * 需要监听的扩展名
     */
    ext: 'ts,js,json',
    /**  
     * 需要忽略的文件
     */
    ignore: [],
    /**
     * 环境变量
     */
    env: merge(process.env, { NODE_ENV: 'development' })
  }
}
