 # Servidor
 FROM nginx:alpine

 # Remover site nginx padrão
 RUN rm -rf /usr/share/nginx/html/*

 # Copia os arquivos estáticos HTML, CSS e JavaScript para o diretório raiz da web Nginx padrão
 COPY ./src /usr/share/nginx/html

 # O Nginx expõe a porta 80 por padrão, onde o servidor irá executar.
 EXPOSE 80