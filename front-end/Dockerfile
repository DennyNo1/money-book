# build
# If you have network issues, try these alternatives:
# FROM node:18-alpine AS build  # Smaller image
# FROM node:18-slim AS build    # Smaller image
FROM node:18 AS build
WORKDIR /app 
#设置工作目录为 /app
#所有后续命令都将在这个目录下执行，等效于 cd /app
COPY . .
# 将当前主机目录的所有文件（.）复制到容器内的 /app 目录中
# 通常这里会包括 package.json、src、public 等前端项目文件
RUN npm install && npm run build

# production
FROM nginx:alpine
# 启动第二阶段：使用轻量的 Nginx 镜像作为生产环境
# nginx:alpine 是极简版本，体积小（< 20MB）
COPY --from=build /app/build /usr/share/nginx/html
# 将第一阶段 build 阶段中 /app/build 目录复制到 Nginx 的默认网页根目录 /usr/share/nginx/html
# 这一步就是把构建好的静态页面交给 Nginx 来托管
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# 设置容器启动时执行的命令

# nginx -g 'daemon off;' 表示启动 nginx 并在前台运行

# Docker 容器要求主进程必须保持前台运行，否则容器会退出