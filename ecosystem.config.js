// PM2 Configure

module.exports = {
  apps: [
    {
      name: 'panel-api-server',
      max_memory_restart: '200M',
      instances: 1,
      instance_var: 'PANEL-SERVER',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        SERVER_PORT: 4000,
        SITE_NAME: 'Panel',
        SITE_HOST: 'http://127.0.0.1:4000'
      },
      script: './dist/main.js',
      interpreter_args: '--harmony'
    }
  ]
}