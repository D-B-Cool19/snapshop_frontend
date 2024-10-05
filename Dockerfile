FROM node:18-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:18-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/build ./build
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile
EXPOSE 3000
CMD ["node", "build"]