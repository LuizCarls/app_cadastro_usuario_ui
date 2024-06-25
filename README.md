# Web Cadastro de Usuários

O objetivo principal deste projeto é fornecer funcionalidades para gerenciar usuários dentro de um sistema. Isso inclui permitir a inclusão de novos usuários, possibilitar a edição de informações existentes, facilitar a consulta para visualização detalhada de perfis de usuário e também permitir a exclusão de usuários quando necessário.

# Como Executar o Projeto com Docker

Este projeto é uma aplicação front-end que utiliza HTML, CSS e JavaScript, e é executado dentro de um contêiner Docker com Nginx.

## Pré-requisitos

- Docker instalado no seu sistema operacional. Se ainda não tiver, você pode baixar e instalar a versão adequada para o seu sistema em [Docker Hub](https://hub.docker.com/).

## Como executar através do Docker

Certifique-se de ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Execute **como administrador** o seguinte comando para construir a imagem Docker:

```
$ docker build -t app_cadastro_usuario_ui .
```

Uma vez criada a imagem, para executar o container basta executar, **como administrador**, seguinte o comando:

```
$ docker run -d -p 8080:80 --name docker app_cadastro_usuario_ui
```

Uma vez executando, para acessar a API, basta abrir o [http://localhost:8080/views/index.html](http://localhost:8080/views/index.html) no navegador.



### Alguns comandos úteis do Docker

>**Para verificar se a imagem foi criada** você pode executar o seguinte comando:
>
>```
>$ docker images
>```
>
> Caso queira **remover uma imagem**, basta executar o comando:
>```
>$ docker rmi <IMAGE ID>
>```
>Subistituindo o `IMAGE ID` pelo código da imagem
>
>**Para verificar se o container está em exceção** você pode executar o seguinte comando:
>
>```
>$ docker container ls --all
>```
>
> Caso queira **parar um container**, basta executar o comando:
>```
>$ docker stop <CONTAINER ID>
>```
>Subistituindo o `CONTAINER ID` pelo ID do conatiner
>
>
> Caso queira **destruir um conatiner**, basta executar o comando:
>```
>$ docker rm <CONTAINER ID>
>```