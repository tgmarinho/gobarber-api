## Aula 20 - Listagem de prestadores de serviços

Vamos criar a listagem de usuários prestadores de serviço, embora seja a mesma entidade de usuários, iremos criar um controller específico para o tipo de usuário provider.

- Criamos uma nova rota para /providers
- Criamos um novo controller ProviderController.js
- Buscamos todos os usuários que são providers, e trouxemos inclusive o relacionamento com o Avatar, excluindo campos desnecessários
- Criamos um campo virtual url e para montar a URL da imagem
- Demos um apelido para File, para se chamar avatar na criação do objeto de retorno da requisição.
- Permitimos o servidor servir o arquivo de forma estática

Fim: [https://github.com/tgmarinho/gobarber/tree/aula20](https://github.com/tgmarinho/gobarber/tree/aula20)
