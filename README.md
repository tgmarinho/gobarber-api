## Aula 34 - Configurando fila com Redis

Quando utilizamos rotas que enviam email para o usuário, elas estão demorando um pouco mais para concluir a requisição, pois elas esperam a requisição concluir para depois devolver a resposta para o usuário, e isso demora porque depende de um serviço externo de envio de email, que depende da internet, etc, fazendo com que demore para concluir a requisição.

Eu poderia remover o `async`e deixaria mais rápido a execução da requisição, pois o email seria enviado de forma assíncrona também, porém se desse algum problema no envio de email eu não poderia informar isso ao usuário.

```
   Mail.sendMail({
    ...
    });
```

A melhor forma de controlar isso é com FILAS, com background jobs, controlar que serviços rodem em segundo plano, e de forma que podemos enviar mensagem para o usuário.

Precismos de um banco não relacional que armazena chave e valor apenas, não tem schemas e nem models. Ele é muito mais perfomático. E iremos utilizar o Redis no Docker.

Para configurar o [https://redis.io/](https://redis.io/) no docker:

```
docker  run  --name redisbarber -p 6379:6379 -d  -t redis:alpine
```

A versão com alpine vem bem leve, vem com as features mais essencias do linux.

Agora vamos instalar o [bee-queue](https://github.com/bee-queue/bee-queue), que é uma ferramenta de background jobs no node, ele é mais simples e não tem todos os recursos que outros tem, por exemplo o [kue](https://github.com/Automattic/kue). Mas para essa aplicação já serve. Kue é menos performatico mas tem mais rebustez. Com Bee Queue ele agenda os jobs e faz retentativas de reenvio de email, que é o necessário e suficente para aplicação, por isso escolhemos essa lib.


Para instalar o bee-queue:

```
yarn add bee-queue
```

Passo a passo da codificação da configuração de envio de email com agendamento de jobs em filas:

- Primeiro configurar o Redis em execução da máquina com a aplicação:

`src/config/redis.js`:

```
export default {
  host: '127.0.0.1',
  port: 6379,
};
```
Coloco o endereço do servidor onde está executando o Redis e a porta de entrada de requisição.

- Depois crio o JOB: `CancellationMail.js` que é responsável pelo envio de email quando o usuário cancela um appointment, e removo o envio de email lá do `AppointmentController.js`:

```
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
```

O Job precisa de uma chave (key) que é o nome do JOB, e o JOB em si, que é uma função que chamos de handle, que recebe vários parâmetros, e nesse caso desestruturamos o parâmetros para pegar apenas os dados (data) do appointment que foi enviado na criação do JOB que fica dentro da Queue que iremos ver no próximo código abaixo.
Depois o restante do código é o que estava no `AppointmentController.js` no método `delete`.


Logo, criamos a classe` Queue.js` que se refere a Fila, é a classe que faz o gerencimento da Fila, de inicializar, adicionar e processa fila.

```
import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.process(handle);
    });
  }
}

export default new Queue();
```

Definimos uma const jobs, que recebe um array de jobs, no nosso caso só tem um Job, mas poderia ter mais.

No construtuor criamos uma váriavel `queues` que é um objeto que armazena os jobs na fila, e chamamos o `init()` para percorrer o array de jobs e adicionar na fila, a chave: 'CancellationMail' com o valor: que é um Bee que é uma instância do JOB que também recebe a mesma chave como valor e configuração de conexão com Redis, e por fim recebe o handle que é o método de dentro do job que nesse caso envia o email.

O método add, recebe a queue e o job. Queue é o nome do processo na fila e o job é o objeto que guarda os dados que serão executados no job. O método cria dentro da fila que foi inicializada o job em si, passando os valores que serão utilizados na execução do job, contém os dados do appointment no no caso.

O método processQueue percore os jobs, e chama a fila para ser processada passando o método handle que deve ser executado de dentro do Job.

Agora utilizamos o Job e fila Queue no AppointmentController.js:

Importando os códigos e substituindo o envio de email por Utililizar a instância de Queue para adicionar na fila o nome do Job e os dados que o Job deve processar:
```
...
import CancellationMail from  '../jobs/CancellationMail';
import Queue from  '../../lib/Queue';
...
await Queue.add(CancellationMail.key, { appointment });
...
```

Podemos deixar o job executando em uma outra instãncia do Node no servidor:
Criando um arquivo `src/queue.js`:
```
import Queue from  './lib/Queue';
Queue.processQueue();
```

Criar um script no package.json para rodar com sucrase uma vez que estamos utilizando o import/export:

```
"queue":  "nodemon src/queue.js"
```

E para executar só chamar: `yarn queue``

Para testar só tentar cancelar um appointment novamente.


Fim: [https://github.com/tgmarinho/gobarber/tree/aula34](https://github.com/tgmarinho/gobarber/tree/aula34)
