FROM node:24-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
ENV PORT=3002

EXPOSE 3002

CMD ["npm", "start"]
