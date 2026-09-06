# StoryFlow production backend image
# FFmpeg is required for server-side video rendering.

FROM node:20-slim AS build
RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

FROM node:20-slim AS production
RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 storyflow \
  && useradd --system --uid 1001 --gid storyflow --create-home storyflow

WORKDIR /app/backend
ENV NODE_ENV=production

COPY --from=build --chown=storyflow:storyflow /app/backend/package*.json ./
COPY --from=build --chown=storyflow:storyflow /app/backend/node_modules ./node_modules
COPY --from=build --chown=storyflow:storyflow /app/backend/dist ./dist
COPY --from=build --chown=storyflow:storyflow /app/backend/src/database/migrations ./dist/database/migrations

USER storyflow
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "dist/server.js"]
