FROM node:22-slim

#dependency for prisma
RUN apt-get update -y && apt-get install -y openssl libssl-dev ca-certificates

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

RUN chmod +x backend-entrypoint.sh

RUN npm run build

EXPOSE 3000

CMD ["sh", "./backend-entrypoint.sh"]