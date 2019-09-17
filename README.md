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
