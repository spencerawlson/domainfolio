# ---- Builder ------------------------------------------------------------------
FROM node:22-bookworm-slim AS builder

# better-sqlite3 compiles a native module; build tools live in this stage only.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Production ---------------------------------------------------------------
# next.config.ts sets output: "standalone": the build emits a self-contained
# server.js plus only the node_modules it traced (better-sqlite3 included).
FROM node:22-bookworm-slim AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATA_DIR=/app/data

WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN mkdir -p /app/data
EXPOSE 3000
CMD ["node", "server.js"]
