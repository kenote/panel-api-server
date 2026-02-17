all: install

# 安装所需模块
install:
	@npm install

# 开发调试
devlop:
	@npm run dev

# 编译
build:
	@npm run build

# 启动服务
start:
	@[ -f ecosystem.config.js ] && pm2 start ecosystem.config.js && pm2 save

# 停止服务
stop:
	@[ -f ecosystem.config.js ] && pm2 stop ecosystem.config.js

# 重启服务
restart:
	@[ -f ecosystem.config.js ] && pm2 restart ecosystem.config.js

# 移除服务
delete:
	@[ -f ecosystem.config.js ] && pm2 delete ecosystem.config.js && pm2 save --force

# 清理日志/任务/上传文件
clear:
	@rm -rf logs/*
	@rm -rf tasks/*
	@rm -rf uploadfiles/*