FROM node:22-alpine AS build

WORKDIR /app

# As URLs entram no bundle no build; para outro ambiente, construir de novo
ARG VITE_CATALOG_URL=http://localhost:3001
ARG VITE_ORDERS_URL=http://localhost:3002
ARG VITE_AUTH_URL=http://localhost:3003
ARG VITE_USE_MOCKS=false
ENV VITE_CATALOG_URL=$VITE_CATALOG_URL \
    VITE_ORDERS_URL=$VITE_ORDERS_URL \
    VITE_AUTH_URL=$VITE_AUTH_URL \
    VITE_USE_MOCKS=$VITE_USE_MOCKS

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000
