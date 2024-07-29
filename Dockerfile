FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.json next.config.mjs tailwind.config.ts postcss.config.mjs typings.d.ts ./
COPY src ./src
COPY public ./public

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/ ./

EXPOSE 3000

CMD ["npm", "start"]
