# Use Node.js as base
FROM node:20-alpine AS base

# Install dependencies with Bun
FROM base AS deps
RUN apk add --no-cache libc6-compat
# Install Bun for dependency installation
RUN npm install -g bun
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile || (bun install && echo "Lockfile updated during build")

# Build with Node.js (more compatible)
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build environment setup
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create .env from production config for build
RUN if [ -f .env.production ]; then cp .env.production .env; fi

# Build with Node.js instead of Bun
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create system user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public directory
COPY --from=builder /app/public ./public

# Create .next directory with correct permissions
RUN mkdir .next && \
    chown nextjs:nodejs .next

# Copy Next.js build output with correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
