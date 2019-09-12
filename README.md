
## Aula 4 - Configurando o Docker

### Mão na Massa

Baixar o docker (Mac, Linux, Windows): [https://docs.docker.com/install/](https://docs.docker.com/install/)

Para ver se está instalado
`docker -v` ou `docker -help`

Repositório de imagens do Docker: [https://hub.docker.com/](https://hub.docker.com/)

Instalando o postgress:
[https://hub.docker.com/_/postgres](https://hub.docker.com/_/postgres)

```
❯ docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```
Redirecionamento de Portas, toda vez que algum serviço for chamado na porta 5432 do servidor, será redirecionado para 5432 do container no docker:
`-p 5432:5432`

Se já estiver com postgres na máqiuna sem ter sido instaldo pelo Docker, e se estiver executando, você pode alterar na aplicação para: `-p 5433:5432`, isto é, quando for chamado o serviço do postgres 5433, vai ser redirecionado para a porta padrão de dentro do Docker: 5432. Muito legal esse desacoplamento.

Quando já se tem uma imagem no Docker:

pasta executar uma imagem:

```❯ docker run -d 30bf4f039abe```

Para executar um container:

```docker  start a46a366365bb```

Esses caracteres estranhos é o ID da imagem, para ver basta digitar: 
```❯ docker image ls ```
```
❯ docker image ls
REPOSITORY                TAG                 IMAGE ID            CREATED             SIZE
kartoza/postgis           latest              5a242bc9bf9f        4 months ago        990MB
redis                     alpine              c8eda26fcdab        5 months ago        50.9MB
mongo                     latest              a3abd47e8d61        6 months ago        394MB
mongoclient/mongoclient   latest              436b2a2bbe16        6 months ago        1.11GB
adminer                   latest              709d7ce11f75        6 months ago        83.2MB
postgres                  latest              30bf4f039abe        6 months ago        312MB
mongo                     4                   0da05d84b1fe        7 months ago        394MB
```

Vai listar todas as imagens e seus respectivos IDs.


E para conferir se está rodando, só rodar `docker ps`, com isso ele vai listar todos os containers que estão em execução:

```
❯ docker ps                 
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
6f0b42548e9e        30bf4f039abe        "docker-entrypoint.s…"   2 minutes ago       Up 2 minutes        5432/tcp            goofy_hopper
~ 
```

Agora ver o banco funcionando, pode conectar com linha de comando no terminal ou instalar uma GUI:

Linux, Mac e Windows: [https://electronjs.org/apps/postbird](https://electronjs.org/apps/postbird)
ou
Mac: [https://eggerapps.at/postico/](https://eggerapps.at/postico/) 

Só usar os dados da conexão para poder se conectar no postgres.

e criar o banco de dados: `create database gobarber``

Quando reinicia a máquina, o docker para, para subir novamente só seguir os comandos:

```docker ps -a```  para mostrar todos os container mesmo os que não estão em execução.

e depois executar o comando para subir o container:

```docker  start postgres ```

Pode ser o ID ou o nome do container.

Para ver os logs do container:

```docker logs postgres````

O mesmo container pode ser usado para outras aplicações, mas tem como fazer um container apenas para a aplicação.



