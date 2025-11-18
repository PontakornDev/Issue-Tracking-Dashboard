# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn-lock.json* ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Ensure `public` exists so later COPY from builder won't fail if the directory is absent
RUN mkdir -p /app/public

# Build Next.js application
RUN yarn build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files from builder
COPY package.json yarn-lock.json* ./

# Install only production dependencies
RUN yarn install --production

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["yarn", "start"]
