## Aula 8 -Migração de usuário

Para criar as migrations basta rodar  comando:

```
yarn sequelize migration:create --name=create-users
```

Com isso ele vai criar um arquivo:
```
20190913144153-create-users.js
```
Com um template:
```
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};

```

Método up quando a migration é executada e método down para fazer um rollback.

### Migration de Usuário

```
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provider: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};

```


Para rodar a migration:

```
❯ yarn sequelize db:migrate
yarn run v1.12.0
$ /Users/tgmarinho/Developer/bootcamp_rocketseat_studies/gobarber/node_modules/.bin/sequelize db:migrate

Sequelize CLI [Node: 10.16.3, CLI: 5.5.1, ORM: 5.18.4]

Loaded configuration file "src/config/database.js".
== 20190913144153-create-users: migrating =======
== 20190913144153-create-users: migrated (0.040s)

✨  Done in 1.02s.
```

E ai podemos ver o DDL lá na GUI do Postgres:

```

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL UNIQUE,
    password_hash character varying(255) NOT NULL,
    provider boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX users_pkey ON users(id int4_ops);
CREATE UNIQUE INDEX users_email_key ON users(email text_ops);

```

Aleém da tabela users, é criada uma tabela SequelizeMeta que tem os registros de cada migration que foram executadas.

Para desfazer as migrations:

```
yarn sequelize db:migrate:undo
```

Com isso a tabela users não existirá mais.

Desfazer tudo, com isso desfazer todas as migrations que foram executadas e não apenas a última.

```
yarn sequelize db:migrate:undoAll
```
