## Aula 02 - Ajustes na API

Vamos precisar ajustar a API, no backend gobarber.

Vamos instalar o `cors` da aplicação para que o frontend possa acessar a nossa api.

```
yarn add cors
```

E vamos usá-lo no arquivo `app.js`:


```
  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }
  ```

Como estamos em desenvolvimento não vamos passar parametro, mas quando estiveremos em produçào podemos colocar o ip ou endereço:

```
this.server.use(cors({'www.meuapp.com.br'}));
```

Pronto, agora no login do usuário temos que pegar o avatar dele,

então vamos mudar a `SessionController.js` para poder pegar o avatar do usuário:

```
import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import authConf from '../../config/auth';
import User from '../models/User';
import File from '../models/File';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    const { id, name, avatar } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
      },
      token: jwt.sign({ id }, authConf.secret, {
        expiresIn: authConf.expireIn,
      }),
    });
  }
}

export default new SessionController();
```

Para testar tem que estar o banco de dados executando na aplicação, e no Insomnia e testar a aplicação.

E precisamos do avatar no UserController.js quando o usuário editar o perfil, o avatar pode ser alterado também:

```
import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);
    if (user.email !== email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }
    // só faço isso se ele informou a senha antiga, isto é, quer alterar a senha
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    await user.update(req.body);

    const { id, name, avatar, provider } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({ id, name, email, avatar, provider });
  }
}

export default new UserController();
```


Última alteração vai ser no ScheduleController.js onde listaremos também o nome do usuário.

```
...
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });
...
```

Agora para continuar  o desenvolvimento do frontend, temos que estar com o backend executando para podermos consumir a API.

Código: [https://github.com/tgmarinho/gobarber-api/tree/aula-40-ajustes-na-api](https://github.com/tgmarinho/gobarber-api/tree/aula-40-ajustes-na-api)
