FROM node:18-alpine as builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM joseluisq/static-web-server:2
COPY --from=builder /app/dist /public
ENV SERVER_ROOT=/public
ENV SERVER_PORT=8000
ENV SERVER_HEALTH=true
ENV SERVER_FALLBACK_PAGE=/public/index.html
EXPOSE 8000
