## Aula 7 - Configurando o Sequelize

- Criar estrutura de pastas, dentro da `src`
- adicionar a dependência: `yarn add sequelize` no projeto
- adicionar a interface de linha de comando do sequelize: `yarn add sequelize-cli -D`
- criar o arquivo `.sequelizerc` na raiz do projeto para poder configurar os caminhos para as pastas de models, config, para rodar os comandos sequelize-cli:
```
const { resolve } = require('path');

modules.exports = {
  config: resolve(__dirname, 'src', 'config', 'database.js'),
  'models-path': resolve(__dirname, 'src', 'app', 'models'),
  'migrations-path': resolve(__dirname, 'src', 'database', 'migrations'),
  'seeders-path': resolve(__dirname, 'src', 'database', 'seeds'),
};
```

Configurando o database:
- adiciono as dependencias: ```yarn add pg pg-hstore```
- no arquivo config/database.js:
```
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true, // garante que será criado um atributo: created_at e updated_at na tabela do banco de dados.
    underscored: true, // permite o ORM criar nome de tabelas como products_item
    underscoredAll: true, // permite o ORM criar nome dos atributos com caixa baixa e _ em vez de camelCase, pois esse é a convenção de escrita no banco de dados
  },
};
```
