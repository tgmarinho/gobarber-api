#### Pode ler aqui no meu [blog](http://tgmarinho.com)

##### PS. Me ajude a corrigir erros ortográficos, não deu tempo de resvisar o texto!

# Continuando API do GoBarber

## Aula 18 - Configurando Multer

### Upload de imagem

Usuário seleciona a imagem, o upload já é feito e o servidor retorna o ID da imagem.
E no json no cadastro de usuário por exemplo, envia o ID da imagem.

Utilizando o [multer](https://github.com/expressjs/multer) para upload de arquivos.

Quando precisa enviar imagem para o servidor, tem que ser como `Multpart-data` (Multpart Form) e não `json`.

Instalando o `multer`: 

```
yarn add multer
```

Criar uma pasta fora do `src`, para armazenar as imagens: `tmp/uploads`, dentro da pasta `tmp` criar outra pasta `uploads`, onde vai ficar os arquivos físicos de uploads de arquivos.

Criar um arquivo de configuração `multer.js` de dentro da `config`.

```
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
	// Local onde o arquivo será salvo na máquina do servidor
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // Gerando o nome da imagem como um hash usando a lib nativa do node: crypto
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
```

Depois criar um rota:

```
import multer from  'multer';
const upload =  multer(multerConfig);

const upload =  multer(multerConfig);

routes.post('/files', upload.single('file'), (req, res) => {
	return res.json({ ok:  true });
});
```

A rota tem que usar o método post, e o corpo da requisição tem que ser um `multpart-form` em vez de `json`.

Depois adicionar um atributo `file` e adicionar o arquivo nesse atributo.

`upload.single('file')` significa que vou enviar apenas um arquivo dentro da propriedade `file`. 

Essa lib multer permite envio de multiplos arquivos.

Fim: [https://github.com/tgmarinho/gobarber/tree/aula18](https://github.com/tgmarinho/gobarber/tree/aula18)

## Aula 19 - Avatar do Usuário

### Salvando informações do arquivo na base de dados

O atríbuto `req`tem disponível a variável `file` do upload de arquivos que armazena algumas informações sobre o arquivo de upload:

```
{
  "fieldname": "file",
  "originalname": "code-hoc.png",
  "encoding": "7bit",
  "mimetype": "image/png",
  "destination": "/Users/xxx/Developer/bootcamp_rocketseat_studies/gobarber/tmp/uploads",
  "filename": "1d05508938b533ef539026149c597ed5.png",
  "path": "/Users/xxx/Developer/bootcamp_rocketseat_studies/gobarber/tmp/uploads/1d05508938b533ef539026149c597ed5.png",
  "size": 115050
}
```

originalname: é o nome original do arquivo que estava na máquina cliente, que fez o upload.
filename: é o novo nome da imagem que vai ficar salva no servidor.

Para lidar melhor com o upload de arquivo, vou criar o `FileController.js` que conterá a lógica para salvar no banco de dados as referências dos arquivos de upload.

Para salvar os dados do arquivo, vamos criar a tabela files no banco de dados, criando o arquivo de migration.

```
yarn sequelize migration:create --name=create-files
```

E terminar de configurar:

```
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('files', {
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
      path: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    return queryInterface.dropTable('files');
  },
};
```

E para gerar a tabela files no banco de dados conforme a migration, só executar no terminal:

```
yarn sequelize db:migrate  
```

Depois criar o Model File:

```
import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
```

E inserir o Model File no arquivo database/index.js 


```
...
import File from  '../app/models/File';
...
const models = [User, File];
...
```

E agora atualizar o FileController.js para poder receber os dados da requisição do arquivo de upload, e salvar no banco de dados as referências:

```
import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({ name, path });

    return res.json(file);
  }
}

export default new FileController();
```

Agora na hora que enviar novamente o arquivo, a tabela dados irá ser preenchida.


### Relacionando o usuário com imagem de avatar (user <-> files)

Para fazer o relacionamento precisamsos adicionar as chaves primária de files no users.

Para isso teremos que criar uma migration para atualizar essas tabelas:

```
yarn sequelize migration:create --name=add-avatar-field-to-users
```

Adicionamos a coluna `avatar_id` de dentro da tabela  `users`, sendo referenciadas pela tabela `files` no atributo `ID` que é a chave primária da tabela `files`. E quando desfazer a migration é só apagar o atributo `avatar_id` de `users`.

`onUpdate: 'CASCADE'`: Quando atualiza a imagem, altera no usuário
`onDelete: 'SET NULL'`: Quando deletar o avatar deixa o avatar_id como null

```
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
```

Só executar: `yarn sequelize db:migrate` para executar a alteração na tabela `users`.

Depois precisa relacionar o Users com Files de dentro do Model de users no código.

Adicionando um método para associar as duas entidades:

`Users.js`:
```
...
static associate(models) {
	this.belongsTo(models.File, { foreignKey: 'avatar_id' });
}
...
```

E dentro do `database/index.js`, acresento mais um `map`, para poder executar (apenas nas classes que contém o método associate) a associação e passar os models para o associate:

```
 models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
```

Pronto, agora sim, na hora de salvar o usuário a associação irá ocorrer e o ID que for informado no files estará no users.

Fim: Fim: [https://github.com/tgmarinho/gobarber/tree/aula19](https://github.com/tgmarinho/gobarber/tree/aula19)




## Aula 20 - Listagem de prestadores de serviços

Vamos criar a listagem de usuários prestadores de serviço, embora seja a mesma entidade de usuários, iremos criar um controller específico para o tipo de usuário provider.

- Criamos uma nova rota para /providers
- Criamos um novo controller ProviderController.js
- Buscamos todos os usuários que são providers, e trouxemos inclusive o relacionamento com o Avatar, excluindo campos desnecessários
- Criamos um campo virtual url e para montar a URL da imagem
- Demos um apelido para File, para se chamar avatar na criação do objeto de retorno da requisição.
- Permitimos o servidor servir o arquivo de forma estática

Fim: [https://github.com/tgmarinho/gobarber/tree/aula20](https://github.com/tgmarinho/gobarber/tree/aula20)

## Aula 21 - Migration e model de agendamento

- Criar model e migration da tabela de agendamento
- Todas vez que usuário marcar um agendamento com algum provedor de seriviço, irá gerar um registro na tabela de agendamento
- Relacionar usuário cliente e o usuário provider na tabela de agendamento
- Referenciar o model Appointment no models dentro do database/index.js


Fim: [https://github.com/tgmarinho/gobarber/tree/aula21](https://github.com/tgmarinho/gobarber/tree/aula21)

## Aula 22 - Agendamento de serviço

- Criar a rota de agendamento e o controller
- O cliente pode selecionar apenas um usuário que seja provider
- Validar dados de entrada com Yup

Fim: [https://github.com/tgmarinho/gobarber/tree/aula22](https://github.com/tgmarinho/gobarber/tree/aula22)

## Aula 23 - Validações de agendamento

- Validar se a data de agendamento é uma data futura
- Validar se a data de agendamento já está ocupada para o mesmo prestador de serviço
- Permitir agendar de hora em hora
- Utilizar a [DateFNS](https://date-fns.org/)) pra lidar com datas
	- Para instalar: `yarn add date-fns@next`
	- `import { startOfHour, parseISO } from  'date-fns';`
	- `parseISO` transforma `"2019-10-01T18:00:00-04:00"` em Objeto data do JS
	- `startOfHour` despreza os minutos e segundos, e retorna apenas da hora. 18h35 fica apenas 18h.
	- `isBefore(x,y)` verifica se a data do primeiro parametro é anterior a do segundo parametro
- Não permitir agendamento duplicado para o o prestador na mesma hora.	

Fim: [https://github.com/tgmarinho/gobarber/tree/aula23](https://github.com/tgmarinho/gobarber/tree/aula23)

## Aula 24 - Listando agendamentos do usuário

Mostrar todos os agendamentos do usuário logado e mostrar seus prestadores de serviços

- Criar nova rota com método get no `routes.js` para o AppointmentController no método index.
- Buscando todos os agendamentos do usuário logado, que não estão cancelados, tranzendo o usuário provider, prestador de serviço com o seu avatar. Ordenado por data, trazendo apenas os atributos id e data do agendamento.

```
class AppointmentController {
  async index(req, res) {
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }
```
Fim: [https://github.com/tgmarinho/gobarber/tree/aula24](https://github.com/tgmarinho/gobarber/tree/aula24)


## Aula 25 - Aplicando paginação

- No Insomnia utiliza a aba query para passar parametros: page = 1 ou 2, n...
- Pegar o page: `const { page =  1 } = req.query;``
- Definir um limit, de quantos em quantos vou trazer e um offset para definir o corte:
`AppointmentController.js`:
```
...
limit:  20,
offset: (page -  1) *  20,
...
```

Pronto, como tenho poucos registros, então se eu colocar page: 1, já trás todos os registros e se colocar page: 2 vai trazer apenas um array vazio.

Fim: [https://github.com/tgmarinho/gobarber/tree/aula25](https://github.com/tgmarinho/gobarber/tree/aula25)

## Aula 26 - Listando agenda do prestador 

- Mostar no painel do prestador de serviço a listagem de sua agenda
- Criar uma nova rota para agenda do provider (schedule)
- Criar um novo controller: ScheduleController.js
- Verificar se o usuário logado é um provider(prestador)
- buscar agenda pela data e fazer um parseISO
- buscar os agendamentos do provedor logado, que não esteja cancelado e que a data seja no ínicio do dia buscado até o final do dia.

```
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();
```
Fim: [https://github.com/tgmarinho/gobarber/tree/aula26](https://github.com/tgmarinho/gobarber/tree/aula26)


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

## Aula 29 - Listando notificações do usuário

- Criar uma rota get notifications
- Criar o controller `NotificationController.js`:

```
import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    /**
     * Check if loggedUser is a provider
     */
    const checkIsProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }
}

export default new NotificationController();
```

Fim: [https://github.com/tgmarinho/gobarber/tree/aula29](https://github.com/tgmarinho/gobarber/tree/aula29)


## Aula 30 - Marcar notificações como lidas

- Criar nova rota put notifications

Utilizando `findByIdAndUpdate` do mongo para buscar e atualizar os registros, para isso funcionar tem que estar marcado lá na conexão com mongodb: `useFindAndModify:  true`:

```
mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      {
        useNewUrlParser: true,
        useFindAndModify: false, // Agora posso usar findByIdAndUpdate
        useUnifiedTopology: true,
      }
    );
```
Entendendo a query:

```
 const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
      },
      { new: true }
    );
```

- `findByIdAndUpdate` = Busco e atualizo o registro
- `req.params.id` = é o id do registro no mongo que foi passado como parametro na query de consulta no frontend
 -  `{ read: true }`  é o valor que eu quero alterar, sempre por default é falso o valor registrado, e agora quero alterar para true, pois foi lida.
 - `{ new:  true }` retorno para o usuário a notificação para dentro de const  notification atualizado
 

#### Leandro VieiraToday at 2:42 PM

@Thiago Marinho encontrei esse erro também.. realmente está deprecado, e a solução foi utilizar "updateOne" .. é possível passar o ID para filtrar.. ([https://mongoosejs.com/docs/documents.html#updating](https://mongoosejs.com/docs/documents.html#updating "https://mongoosejs.com/docs/documents.html#updating")) em um exemplo de uma aplicação pessoal, utilizei: await post.updateOne(req.params.id, { date: updatedDate, hidden: !req.body.hidden, }); espero que ajude!


Fim: [https://github.com/tgmarinho/gobarber/tree/aula30](https://github.com/tgmarinho/gobarber/tree/aula30)

## Aula 31 - Cencelamento de agendamento

- Usuário só pode cancelar o agendamento se for duas horas antes do evento
- Criar uma rota delete appointment passando o id.
	- `routes.delete('/appointments/:id', AppointmentController.delete);`
- Criar o método delete no AppointmentController.js:
```
...
import { startOfHour, parseISO, isBefore, format } from  'date-fns';
...
...
async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id);

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    // removo duas horas da data agendada
    const dateWithSub = subHours(appointment.date, 2);
    const NOW = new Date();
    if (isBefore(dateWithSub, NOW)) {
      return res.status(401).json({
        error: 'You can only cancel appointment 2 hours in advance.',
      });
    }

    appointment.canceled_at = NOW;

    await appointment.save();

    return res.json(appointment);
```

- Busco o appointment com o valor passando no query params com id do appointment
- Verifico se o usuário logado é dono do appointment
- Removo duas horas da data agendada, pois só pode cancelar o evento duas horas antes
- verifico se a hora appointment é antes da hora atual, se for envio mensagem de error
- Se não for continua o fluxo setando no canceled_at a data atual.
- Salvo o appointment e retorno para o usuário

Fim: [https://github.com/tgmarinho/gobarber/tree/aula31](https://github.com/tgmarinho/gobarber/tree/aula31)

## Aula 32 - Configurando Nodemailer

- Vamos enviar um email para o prestador de serviço quando um agendamento for cancelado.
- Utilizar a lib [nodemailer](https://nodemailer.com/about/)) para envio de emails.

 ```
yarn add nodemailer
```

Serviços de envio de email:
	- SendGrid
	- Mailgun
	- Amazon SES (*Rocketseat Choice*)
	- Sparkpost
	- Mandril (Mailchimp)
	- Mailtrap (__DEV) // só para desenvolvimento

Vamos utilizar o Mailtrap para poder enviar o email para uma caixa de entrada fake, o email pode até ser verdadeiro, porém quando é enviado, ele não chega na caixa de entrada da pessoa, isso é ideal para termos em ambiente de desenvolvimento.

Primeiro passo é crair um conta no [https://mailtrap.io/](https://mailtrap.io/) e pegar as configurações.

Criar um arquivo de configuração de envio de emails:

`src/config/mail.js`:
```
export default {
  host: 'smtp.mailtrap.io',
  post: 2525,
  secure: false,
  auth: {
    user: '109b42360028f1',
    pass: '907f3523d2a604',
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  },
};

```

Depois configurar o envio de email usando os dados do mail.js para se conectar ao provedor:

```
import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
```

Por fim utilizar no controller: 

```
...
import Mail from  '../../lib/Mail';
...

// Alterando a busca de appointment para trazer o usuário:
const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
      ],
    });
...
// Enviando email
 await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      text: 'Você tem um novo cancelamento',
   });
```


Fim: [https://github.com/tgmarinho/gobarber/tree/aula32](https://github.com/tgmarinho/gobarber/tree/aula32)


## Aula 33 - Configurando templates de email

- Criar templates de email, com html, css, 
- Utilizar template engine: [https://handlebarsjs.com/](https://handlebarsjs.com/)
- Instalar libs para utilizar o handlebars:
	- `yarn add express-handlebars nodemailer-express-handlebars`

Basicamenteo foi feito a integração do handlebars no Mail.js para declarar onde estão as pasta de templates e a extensão de arquivo. E no `AppointmentController.js` foi utilizado o template `cancellation.hbs` no envio de email.

Mais detalhes ver o código.

Fim: [https://github.com/tgmarinho/gobarber/tree/aula33](https://github.com/tgmarinho/gobarber/tree/aula33)


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


## Aula 35 - Monitorando falhas na fila

Para poder ouvir os erros do processamento de jobs e obter um log, só alterar o código: 

```
processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
}

handleFailure(job, err) {
 console.log(`Queue ${job.queue.name}: FAILED`, err);
}
```

Com isso a cada erro que acontecer podemos ver no log do servidor, posteriomente iremos mostrar de forma mais amigável.

Na documentação do bee-queue tem outros listeners também, de sucesso, etc.

Fim: [https://github.com/tgmarinho/gobarber/tree/aula35](https://github.com/tgmarinho/gobarber/tree/aula35)


## Aula 36 - Listando horários disponíveis

Criar um controller para mostrar os horários disponíveis do prestador de serviço de uma dia
Quero saber todos os horários disponíveis do prestador para um determinado dia.

- Criar uma rota :
```
routes.get('/providers/:providerId/available', AvailableController.index);
```
Criar um controller `AvailableController.js`;

```
import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);

    // 2019-09-18 10:49:44

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const schedule = [
      '08:00', // 2019-09-18 08:00:00
      '09:00', // 2019-09-18 09:00:00
      '10:00', // 2019-09-18 10:00:00
      '11:00', // ...
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        // format to: 2019-09-18T15:40:44-04:00
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
```

Só vai retornar os horários que não tem appointment marcado e que o valor desejado será posterior a data atual (isto é não se pode marcar um agendamento para um horário que já passou).

Recebo da requisição o ID do prestador e o dia que o usuário quer ver os horários disponíveis.

Essa data vem como timestamp e formato de string do componente datepicker do frontend. Então é preciso transformar um Number. 

Depois busco todos agendamentos do provider informado pelo parâmetro da requisição, que não estejam cancelados, e que a data seja entre a primeira e última hora do dia informado.

Crio uma tabela estática de horários fixos.

E faço o restante da lógica e retorno para o usuário os horários em um objeto que retorna:

```
 {
    "time": "15:00",
    "value": "2019-09-18T15:00:00-04:00",
    "available": false
  },
  {
    "time": "16:00",
    "value": "2019-09-18T16:00:00-04:00",
    "available": true
  },
  {
    "time": "17:00",
    "value": "2019-09-18T17:00:00-04:00",
    "available": true
  },
```

Fim: [https://github.com/tgmarinho/gobarber/tree/aula36](https://github.com/tgmarinho/gobarber/tree/aula36)


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


Chegamos ao final da aplicação =)
