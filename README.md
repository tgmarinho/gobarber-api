## Aula 39 - Variáveis de ambiente

Criar variáveis de ambiente para proteger os dados sensíveis e permitir que variáveis sejam configuradas para cada ambiente que a aplicação está rodando.

Vamos criar um arquivo `.env` e um `.env.example` o .env nunca deverá ser commitado, ele é particular de seu ambiente, o .env.example como nome sugere é um exemplo das variáveis que devem ser preenchidas.
Elas estão sendo usadas em vários arquivos da aplicação. Os dados que não são sensíveis podem manter no .env.example.

Para utilizar temos que instalar uma lib  [dotenv](https://github.com/motdotla/dotenv) que serve para carregar as variáves de dentro do `.env` para o `nodejs`, no `process.env`.

Para funcionar precisamos importar a lib no arquivo principal do projeto, `app.js`:

```
import 'dotenv/config';
...
```

e dentro do `queue.js` também.
```
require('dotenv/config');
...
```

Arquivo `.env.example`:

```
# create a .env and configure it for you environment

APP_URL=http://localhost:3333
NODE_ENV=development

# Auth

APP_SECRET=

# Database

DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=

# Mongo

MONGO_URL=

# Redis

REDIS_HOST=127.0.0.1
REDIS_POST=6379

# Mail

MAIL_HOST=
MAIL_PORT=
MAIL_SECURE=false
MAIL_USER=
MAIL_PASS=
MAIL_FROM=

# Sentry

SENTRY_DSN=
```

Pronto, agora é substituir onde estão essas variáveis:

Exemplo: `src/config/database.js`:

```
require('dotenv').config();

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

```
Fim: [https://github.com/tgmarinho/gobarber/tree/aula39](https://github.com/tgmarinho/gobarber/tree/aula39)

