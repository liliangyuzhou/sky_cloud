FROM nginx:latest
MAINTAINER 1287641566@qq.com
COPY ../dist /usr/share/nginx/html/

FROM nginx
LABEL MAINTAINER="1287641566@qq.com"
# 瑕嗙洊default閰嶇疆
COPY nginx.conf /etc/nginx/conf.d/
COPY ../dist /usr/share/nginx/html


EXPOSE 80
