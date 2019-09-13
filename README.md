## Aula 9 - Criação do Model de Usuário

Criar um model o sequelize, dentro da pasta models, criar uma arquivo: user.js:

```
import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
  }
}

export default User;

```

Criei a classe User que extend de Model do sequelize para receber todos métodos que tem na Model, agora a nossa classe de domínio User é uma Model, devido a herança.
De dentro do método statico init passo uma parametro sequelize do Model, e chamo o super da model, informando os atributos da tabela users, e com isso é feito o mapeamento do ORM entre as entidades do banco de dados e o objeto da aplicação, para entidade User.
