-- 创建数据库并指定所有者和字符集
CREATE DATABASE "panel-api-server"
WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1; -- -1表示无限制
