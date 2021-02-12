# Build React Application
FROM node:latest as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
RUN npm run build

# Build Nginx
FROM nginx:latest
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf
