## Aula 38 - Tratamento de Exceções

Vamos fazer o tratamento de exceções que ocorrem em produção, na fila de envio de email, query de banco de dados, etc.

Ver logs de erro no servidor é muito complicado, chato e trabalhoso, vamos utilizar uma ferramenta mais amigável com uma boa UI que fica fácil de descobrir o erro, dessa forma não vamos correr atrás do erro, o erro vem até nós.

Tem duas ferramentas para ajudar com isso:

- [https://www.bugsnag.com/](https://www.bugsnag.com/)
- [https://sentry.io/welcome/](https://sentry.io/welcome/)

Vamos utilizar o sentry, pois tem uma integração muito boa com nodejs, a vantagem de usar essa ferramenta é que a cada exceção que ocorre na aplicação, vamos receber uma mensagem no sentry.io, um email ou podemos até integrarar com slack para receber mensagem em algum canal do grupo do projeto e até mesmo criar uma issue automática no github.

- Primeiro passo é criar a conta no [https://sentry.io/](https://sentry.io/).
- Configurar o projeto como Express ou Node, como estou usando express é melhor selecionar o Node.
- Depois instalar a dependência no projeto:
```
yarn add @sentry/node
```
e instalar o [https://www.npmjs.com/package/express-async-errors](https://www.npmjs.com/package/express-async-errors) se faz necessário por que os métodos que são executados com async de dentro do controllers, o express não consegue captar as exceções e enviar para o Sentry, então baixando e configurando essa extensão vai dar certo.

```
yarn add express-async-errors
```
E por fim o [youch](https://github.com/poppinss/youch) que é uma ferramenta muito boa para exibir mensagens de erro de forma amigável e bonita, que pode ser em formato json ou até mesmo html. Como ele se descreve: *Pretty error reporting for Node.js 🚀*

Depois eu crio um arquivo de configuração onde armazeno o dsn do Sentry:

```
export  default {
	dsn:  'https://xxxx_aqui_eh_meu_pega_o_seu_no@sentry.io/999999',
};
```

E no app.js temos que integrar o Sentry e o Youch na aplicação.

Detalhe que o import do Sentry tem que ser do jeito que está no código abaixo, o import do express-async-errors tem que ser antes das rotas.

Temos que inicializar o Sentry antes dos middlewares e outas, temos que invocar o exceptionHandler depois dos middlewares e rotas.

E temos que colocar esse código  `this.server.use(Sentry.Handlers.requestHandler());` chamar antes das rotas e outros middlewares.

Isso tudo está na documentação do Sentry.

exceptionHandler é um middleware que de tratamento de exceção, isso se observar pelos quatros parâmetros, sendo que o primeiro é  o err. Então express entende que esse middleware é um gerenciador de tratamento de erros. Se der algum erro na aplicação esse middleware é chamado e retorna um status 500 utilizando o Youch para trazer uma mensagem mais completa e com boa UI.

```
import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import 'express-async-errors';
import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();
      return res.status(500).json(errors);
    });
  }
}

export default new App().server;
```

Fim: [https://github.com/tgmarinho/gobarber/tree/aula38](https://github.com/tgmarinho/gobarber/tree/aula38)
