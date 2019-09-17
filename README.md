## Aula 27 - Configurando MongoDB

- Conectar a aplicação com banco de dados não estrutural, pois iremos armazenar alguns dados que não são estruturados.

- Criando um container do Mongo utilizando o Docker para baixar e configurar:

```
docker run --name mongobarber -p 27017:27017 -d  -t mongo
```

Para saber se o mongo está funcionando: [http://localhost:27017/](http://localhost:27017/)
Ou executar `docker ps` pra ver os containers em execução.

- Instalar o Mongoose para ser o ORM, semelhante ao Sequelize do SQL:

```
yarn add mongoose
```
- Utilizando o Mongoose

Vamos inicializar o mongo dentro do `database/index.js`, assim como foi iniciando o postgres.

Criamos a função `mongo()` que contém a configuração de conexão com `mongodb`, como não foi criado um usuário e senha na criação do container, então não precisa informar na string de conexão, basta só informa o endereço da máquina (host), e passamos o nome da collection que é criada assim que a conexão é efetuada, ela não precisa exisitir primeiro, ao contrário da conexão com postgres (SQL).
```
import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      {
        useNewUrlParser: true, // estou utilizando um formato novo na string de conexão
        useFindAndModify: true, // para poder buscar e atualizar os registros
        useUnifiedTopology: true, // DeprecationWarning apareceu no console então eu estou usando, conforme a recomendação do mongo
      }
    );
  }
}

export default new Database();
```
Fim: [https://github.com/tgmarinho/gobarber/tree/aula27](https://github.com/tgmarinho/gobarber/tree/aula27)
