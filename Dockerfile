FROM node:alpine AS build
# WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
# production environment
FROM nginx:stable-alpine
COPY --from=build /dist /usr/share/nginx/html
COPY --from=build /nginx.conf /etc/nginx/sites-enabled/default
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
