FROM node:22-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/app/storage/data \
    UPLOAD_DIR=/app/storage/uploads

RUN mkdir -p /app/storage/data /app/storage/uploads && chown -R node:node /app
USER node
EXPOSE 3000
VOLUME ["/app/storage"]
CMD ["node", "server.js"]
