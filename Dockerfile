# This file is used to create the production environment.

FROM node:alpine as builder
WORKDIR '/app'
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
# EXPOSE is communication between developers  
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html



