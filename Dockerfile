# Stage 1: Build
FROM node:alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm cache clean --force
RUN npm install -g --legacy-peer-deps && npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:alpine as production
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
