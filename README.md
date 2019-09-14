## Aula 15 - Middleware de autenticação

Criar um Middleware para **bloquear** o usuário se ele não estiver logado na aplicação.

Para garantir que o usuário está logado, ele tem que ter o token no header.

Então quando for chamar a rota de update usando o método `put` na rota `/users`, antes de chamar o `UserController.update`, tem que chamar o `authMiddleware`, que vai verificar se o `token` está presente na requisição.

Código do Middleware:
`app/middleware/auth.js`:

```
export default (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  next();
};
```

`routes.js`:

```
routes.put('/users', authMiddleware, UserController.update);
```

Ou podemos utilizar de forma global, e toda a rota abaixo de use(authMiddleware) devem ser autenticadas:

```
import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Todas as rotas que forem chamadas a partir daqui tem que ser autenticada
routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
```

Middleware de autenticação completo:

```
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
```

Estou utilizando promisfy do node para transformar o callback do jwt.verify em promise e poder utilizar o async/await para poder resolver a promisse, fica muito melhor. Invocando o promisy, passo a função que contém o callback, ele me retorna uma verify em promise e passos os valores da função. E assim verifico se o token é valido.

O decode recebe o ID do usuário por foi o atributo que foi passado como payload na geração do token (ver arquivo `SessionController.js`):

```
token: jwt.sign({ id }, authConf.secret, {
	expiresIn: authConf.expireIn,
}),
```

Além do id, o decode recebe o exp: que é a data e hora em timestamp que o token irá expirar.

Foi feito uma trick do JS para remover o Baerer da string do token, o token vem como uma String:

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNTY4NDA1MDAyLCJleHAiOjE1NjkwMDk4MDJ9.NPwa4vr80wAeEJvX9XWNMQAsUWXaDoSUwuw1KAR4wVw
```

E precisamos apenas do valor do token, para isso desestruturamos o array, que foi gerado pelo split(' '), que cortou a string em dois, pelos espaços (q no caso só tem um espaço na string) e retornou o array:

```
const [, token] = authHeader.split(' ');
```

```
['Bearer','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNTY4NDA1MDAyLCJleHAiOjE1NjkwMDk4MDJ9.NPwa4vr80wAeEJvX9XWNMQAsUWXaDoSUwuw1KAR4wVw']
```

E como não precisamos do `Baerer`, então fazemos apenas: `const [, token]`, menosprezamos o valor da primeira posição, pois a palavra `Baerer` é insignificante no nosso contexto e ficamos apenas com o `token`.

E por fim pegamos o ID do usuário que estava no payload do token e guardamos na requisição:

```
req.userId = decoded.id;
```

E agora com isso no método update do UserController.js teremos acesso, e em todos os controllers que passarem pela verificação de autenticação:

`UserController.js`:

```
 async update(req, res) {
    console.log(req.userId);
    return res.json({ ok: true });
}
```

Fim: [https://github.com/tgmarinho/gobarber/tree/aula15](https://github.com/tgmarinho/gobarber/tree/aula15)
