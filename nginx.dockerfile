FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY deployment/nginx.conf /etc/nginx/conf.d/

EXPOSE 80