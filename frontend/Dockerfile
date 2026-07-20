# development
FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# production
# FROM node:20-slim

# WORKDIR /app

# RUN npm install -g serve

# COPY package*.json ./
# RUN npm ci

# COPY . .

# RUN npm run build

# EXPOSE 5173

# CMD ["serve", "-s", "dist", "-l", "5173"]
