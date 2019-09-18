## Aula 37 - Campos virtuais no agendamento

Listar campos a mais, para que o frontend possa mostrar um agendamento que já aconteceu, para isso vamos criar um variável past que será virtual, uma tabela que não existe na tabela, apenas no Model.

No `Appointment.js`:

```
import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
```

E no método `index` do `AppointmentController.js` passar os atributos `past` e `cancelable`:

```
...
attributes: ['id', 'date', 'past', 'cancelable'],
...
```

Agora no Insomnia só fazer a buscar e verificar se os campos são listados com `true` ou `false`.



Fim: [https://github.com/tgmarinho/gobarber/tree/aula37](https://github.com/tgmarinho/gobarber/tree/aula37)
