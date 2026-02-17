# panel-api-server

### 开发调试

```bash
# 编辑环境变量
cp .env.example .env

# 安装模块
npm install

# 运行调试
npm run dev
```

### PM2 部署

::: 创建 :::
```bash
# 拉取代码
git clone https://github.com/kenote/panel-api-server.git

# 安装模块
cd panel-api-server && npm install

# 编译代码
npm run build

# 编辑环境变量
cp .env.example .env

# 启动 PM2
make start
```

::: 更新 :::
```bash
# 拉取新的源代码
git pull

# 重新编译代码
npm run build

# 重启 PM2
make restart
```

### Docker 部署

::: 创建 :::
```bash
# 拉取代码
git clone https://github.com/kenote/panel-api-server.git

# 编译镜像
cd panel-api-server
docker build -f Dockerfile --tag panel-api-server .

# 编辑环境变量
cp .env.example .env

# 启动容器
docker-compose up -d
```

::: 更新 :::
```bash
# 拉取新的源代码
git pull

# 卸载容器
docker-compose down

# 编译镜像
docker build -f Dockerfile --tag panel-api-server .

# 启动容器
docker-compose up -d
```

