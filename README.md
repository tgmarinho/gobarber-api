## Aula 10 - Loader de Models

Para conectar a aplicação com banco de dados  e carregar os models, temos que criar um o arquivo index.js na pasta database.
```
import Sequelize from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}
export default new Database();
```

Quando esse arquivo é importando, ele recebe uma instância do Database, que chama a função init, que instancia para o this.connection a Sequelize com as configurações de conexão com banco de dados. E para cada model que eu importei eu passo a conexão.

E agora só testar, veja o código da aula.

```
// Quando chamo a rota '/', cadastro o usuário e retorno os dados do banco de dados
// http://localhost:3333/

{
  "id": 1,
  "name": "Thiago Marinho",
  "email": "tgmarinho@gmail.com",
  "password_hash": "1232131",
  "updatedAt": "2019-09-13T15:39:29.116Z",
  "createdAt": "2019-09-13T15:39:29.116Z",
  "provider": false
}
```

