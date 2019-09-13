## Aula 14 - Autenticação JWT

Vamos usar a lib [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken):

 ```yarn add jsonwebtoken```

Para criar a autenticação do usuário, podemos criar um controller: SessionController.js que server para tratar a autenticação e não a criação de usuário.

Para gerar string aleatória (secret).
[https://www.md5online.org/](https://www.md5online.org/)
