FROM node:18.8.0 AS frontend
WORKDIR /usr/src/app
COPY ./package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest
WORKDIR  /usr/src/app
COPY --from=frontend ./usr/src/app/ ./
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD nginx -g 'daemon off;'

ENV VITE_APP_MAPBOX_TOKEN='pk.eyJ1IjoiZGhvcGVyNzc3IiwiYSI6ImNsYWtzbGxtaTBxMjQzdnMycTE1eTd6NDQifQ.d1_bl22mOTLyNgCHctRjpg'
ENV VITE_APP_DB_URL='mongodb+srv://dhoper777:apollo777@cluster0.jw3kqlu.mongodb.net/?retryWrites=true&w=majority'
ENV VITE_APP_API_URL = 'http://localhost/api'
