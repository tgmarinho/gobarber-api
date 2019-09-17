## Aula 28 - Notificando novos agendamentos

- Vamos enviar uma notificação para o prestador de serviço toda vez que receber um novo agendamento, e por isso vamos utilizar o MongoDB, vamos adicionar as notificações dentro do mongo.

- Criar os schemas do mongo, semelhante ao model das tabelas.

- MongoDB tem Schema Free, um registro na Collection pode ter um campo e outro registro não ter o campo, isso difere das Tabelas, pois se um registro não tem um certo atributo, ele deve ter o campo com o valor `null`, e no mongo, o campo/registro nem precista existir. Por isso é Schema Free e se chama NOSQL, não tem estrutura. E no mongo também não tem as migrations.
- As notificações não tem muita estrutura, ela armazena o ID do usuário, e as notificações não precisam se relacionar, nem precisa haver consultas com essa coleção (entidade).

- Criando o Schema de Notification:

`app/schema/Notification.js`:
```
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // Cria os campos created_at e update_at automagicamente
  }
);

export default mongoose.model('Notification', NotificationSchema);
```

E no controller utilizamos o schema de Notification para criar um registro no mongo:

```
...
import { startOfHour, parseISO, isBefore, format } from  'date-fns';
import pt from  'date-fns/locale/pt';
import Notification from  '../schemas/Notification';
...
...
 /**
     * Notify appointment provider
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {
        locale: pt,
      }
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });
...
```

Após criar o agendamento, eu crio uma notificação e armazeno no banco de dados, esse dado não é estruturado, eu lanço diretamente no content o nome do usuário e a data, eu não preciso relacionar Notification com Users e nem Appointments e fazer joins e mais joins de SQL, pois a notificação é do estado atual, que o usuário está, se ele mudar o nome dele, isso não é importante para a notificação nesse momento, e com o mongodb ganhasse bastante performance e facilidade justamente por não ter que escrever Queries SQL gigantes e outra vantagem é que podemos escrever em JS para fazer consultas no mongodb.

Fim: [https://github.com/tgmarinho/gobarber/tree/aula28](https://github.com/tgmarinho/gobarber/tree/aula28)
