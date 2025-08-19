# Stage 1: Build the application

FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

# Stage 2: Create the final, smaller production image

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY server.js .
EXPOSE 3000
CMD [ "node", "server.js" ]