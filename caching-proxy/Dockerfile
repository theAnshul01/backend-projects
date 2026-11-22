# Stage 1: Build the application

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Sateg 2: Production image
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit-dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENTRYPOINT ["node", "dist/cli.js"]

