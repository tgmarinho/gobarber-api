
## Aula 3 - Conceitos de Docker

Docker ajuda a controlar os serviços externos da aplicação: Banco de Dados, Redis, etc.

### Como funciona?

- Criação de ambientes isolados (container)
	- Você baixa uma imagem com ambiente configurado, você não precisa instalar os softwares na sua máquina e alterar o seu sistema operacional. Quando a gente instala o postgres com Docker ele se torna um subsistema, e fica rodando na máquina virtual do Docker, sem interferir o ambiente, isso é ótimo porque podemos replicar o mesmo ambiente de desenvolvimento ou produção em outras máquinas, sem problema de arquitetura ou diferença em SO. 
	- Os containers expoe as portas para podemos nos conectar nos containers.
	- Instalando o postgress, sempre usamos a porta :5432, com mongoDB seria na porta :27017, mas trocar portas no Docker é muito simples.

#### Principais conceitos

	- Imagem: São os principais serviços que iremos utilizar, ex: postres, mongodb, redis, etc.
	- Container: é uma instancia de uma imagem, se tivermos uma imagem do mongodb, podemos criar um ou mais containers do mongodb, até mesmo para servir para outras aplicações na máquina
	- Docker Registry (Docker Hub) é onde podemos visualizar e baixar as imagens (ISOs). é basicamente o repositório de imagens, inclusive podemos criar as nossas próprias imagens e hospedar lá.
	- Dockerfile
		- Receita de uma imagem: Define como a imagem da nossa aplicação irá funcionar em um outro computador, em um ambiente do zero.
		- Dockerfile de exemplo para executar a nossa aplicação:
```
# Partimos de uma imagem existente
FROM node:10
# Definimos a pasta e copiamos o arquivos
WORKDIR /usr/app
COPY . ./
# Instalamos as dependências
RUN yarn
# Qual porta queremos expor?
EXPOSE 3333
# Executamos nossa aplicação
CMD yarn start
```