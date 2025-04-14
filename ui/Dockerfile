# Stage 1: Build
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-slim

WORKDIR /app

# Copy only the necessary build output and config
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tailwind.config.js ./ 
COPY --from=builder /app/postcss.config.js ./ 

RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
