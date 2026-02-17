// PM2 Configure

module.exports = {
  apps: [
    {
      name: 'panel-api-server',
      max_memory_restart: '200M',
      instances: 1,
      instance_var: 'PANEL-SERVER',
      exec_mode: 'cluster',
      node_args: '-r dotenv/config',
      env: {
        NODE_ENV: 'production'
      },
      script: './dist/main.js',
      interpreter_args: '--harmony'
    }
  ]
}