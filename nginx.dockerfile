FROM nginx:alpine

ARG DOMAIN

RUN rm /etc/nginx/conf.d/default.conf

COPY deployment/nginx.conf /etc/nginx/conf.d/

EXPOSE 80 443