## Aula 33 - Configurando templates de email

- Criar templates de email, com html, css,
- Utilizar template engine: [https://handlebarsjs.com/](https://handlebarsjs.com/)
- Instalar libs para utilizar o handlebars:
	- `yarn add express-handlebars nodemailer-express-handlebars`

Basicamenteo foi feito a integração do handlebars no Mail.js para declarar onde estão as pasta de templates e a extensão de arquivo. E no `AppointmentController.js` foi utilizado o template `cancellation.hbs` no envio de email.

Mais detalhes ver o código.

Fim: [https://github.com/tgmarinho/gobarber/tree/aula33](https://github.com/tgmarinho/gobarber/tree/aula33)
