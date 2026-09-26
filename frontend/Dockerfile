# Etapa 1: Build de la aplicacion Angular
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx ligero
FROM nginx:alpine
COPY --from=build /app/dist/impresos-trujillo-web/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
