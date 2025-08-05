FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["node", "index.js"]   # 根据你的实际入口文件调整
# docker build -t moneybook-frontend . -t代表tag tag就是别名，id才是image的唯一身份标记