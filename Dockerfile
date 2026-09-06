# AI Story Studio - Full Stack Dockerfile
# For combined frontend + backend deployment (alternative to separate)

# Backend stage
FROM node:20-slim AS backend
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build || npx tsc

# Frontend stage
FROM node:20-slim AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build || echo "Frontend build requires vite"

# Production stage
FROM node:20-slim
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=backend /app/backend/dist ./backend/dist
COPY --from=backend /app/backend/package*.json ./backend/
COPY --from=frontend /app/dist ./dist
COPY --from=backend /app/backend/node_modules ./backend/node_modules
EXPOSE 5000
CMD ["node", "backend/dist/server.js"]
