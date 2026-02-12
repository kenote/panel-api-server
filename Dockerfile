FROM node:20-slim

# 工作目录
WORKDIR /app

# 安装 ping telnet curl 指令 和 sharp 库相关模块
RUN apt-get update && apt-get install -y \
    curl \
    iputils-ping \
    telnet \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 拷贝所需代码
COPY package.json* ./
COPY kenci.config.js ./
COPY tsconfig.json ./
COPY src/ ./src
COPY types/ ./types

# 安装模块
RUN npm install --save node-addon-api node-gyp
RUN npm install
RUN npm run build

# 环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 4000

# 启动服务
CMD ["node", "./dist/main.js"]