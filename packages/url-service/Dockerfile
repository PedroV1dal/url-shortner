# ---------- build stage ----------
FROM node:22-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

# ---------- run stage ----------
FROM node:22-slim

ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

USER node
EXPOSE 3002
CMD ["node", "dist/server.js"]