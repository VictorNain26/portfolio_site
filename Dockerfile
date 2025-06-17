# Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

# Development image
FROM node:20-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install
COPY . .
EXPOSE 3001
CMD ["pnpm", "dev", "-p", "3001"]

# Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "./node_modules/next/dist/bin/next", "start", "-p", "3001"]
