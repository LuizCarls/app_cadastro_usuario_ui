 # Servidor
 FROM nginx:alpine

 # Remover site nginx padrão
 RUN rm -rf /usr/share/nginx/html/*

 # Copia os arquivos estáticos HTML, CSS e JavaScript para o diretório raiz da web Nginx padrão
 COPY views /usr/share/nginx/html/views
 COPY css /usr/share/nginx/html/css
 COPY js /usr/share/nginx/html/js

 # O Nginx expõe a porta 80 por padrão, onde o servidor irá executar.
 EXPOSE 80

 # Comando para incluir o servidor web Nginx em primeiro plano
 CMD [ "nginx", "-g", "daemon off" ]