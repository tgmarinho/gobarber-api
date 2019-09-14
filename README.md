## Aula 17 - Validando dados de entrada

Vamos validar os dados do usuário, é uma boa pratica ter a validação do usuário no frontend no backend, a vantagem de estar no frontend é que a validação é mais rápida, não precisa ir diretamente no servidor para poder verificar se tem algum dado errado ou faltando, ganha em velocidade, também em menos tráfego ao servidor e principamente na segurança. Ter só a validação no frontend não é uma boa prática, na verdade é uma péssima prática.

Vamos validar o frontend com biblioteca [Yup](https://github.com/jquense/yup), que faz uma validação no schema, Schema Validation:

```
yarn add yup
```

### Trecho de código com Yup Validation

Esse código é do método update no UserController.js

```
import  *  as Yup from  'yup';

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
```

Uso o Yup para criar um schema, passado um objeto com o corpo definido por mim, detalhe para campos condicionais, caso o oldPassword é informado o campo password deve ser obrigatório (required), o field no segundo parametro é o password.

Mas se o usuário digitar a senha, ele precisa confirmar a senha, então ele informa o confirmPassword, e ambos precisam ser iguais, então uso a função `oneOf` que recebe um array, e o Yup tem a referências de todos os campos, então uso: `Yup.ref('password')`.

Defino o schema, agora é só validar com os dados que vieram da requisição (req.body):

```
if (!(await schema.isValid(req.body))) {
	return res.status(400).json({ error:  'Validation fails' });
}
```

o método é assincrono então uso await, se tiver algo que não atende os requisitos do Schema Valitation então retorna uma mensagem para o usuário com error: 'Validation Fails'.

Podemos validar os dados informados no Login, dentro do SessionController.js:

```
  const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
```

Aqui verificamos apenas se o usuário informou o email e senha.

Fim: [https://github.com/tgmarinho/gobarber/tree/aula17](https://github.com/tgmarinho/gobarber/tree/aula17)
