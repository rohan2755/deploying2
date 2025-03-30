FROM node:22.12.0-alpine AS deps

WORKDIR /app

# Copy only the files needed to install dependencies
COPY package.json package-lock.json ./

# Install dependencies with the preferred package manager
RUN npm ci


FROM node:22.12.0-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the files
COPY . .

# Copy .env file to ensure environment variables are available
COPY .env .env

# Run build with the preferred package manager
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV=production


# Re-run install only for production dependencies
RUN npm ci --omit=dev && npm cache clean --force


FROM node:22.12.0-alpine AS runner
WORKDIR /app

# Copy the .env file so environment variables are available
COPY --from=builder /app/.env .env

# Copy the bundled code from the builder stage
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Use the node user from the image
USER node

# Start the server
CMD ["node", "dist/main.js"]