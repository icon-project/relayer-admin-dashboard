FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY deployment/default.conf.template /etc/nginx/templates

EXPOSE 80 443