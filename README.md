## Aula 16 - Update do usuário

Código do update do usuário no arquivo: `UserController.js`

```
  async update(req, res) {
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);
    if (email !== user.email) {
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

    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
```

Nesse código:

- Sempre tenho que ter o email do usuário;
- Usuário pode informar a senha antiga, caso queira alterar a senha;
- Pode alterar todos os atributos;
- É feito uma verificação se a senha antiga é a senha atual do usuário
- Aproveito a instância de user que veio do banco de dados no findByPk e altero os dados do usuário, o qual retorna os novos usuário
- Envio via json todos os dados do usuário, exceto a senha.

Fim: [https://github.com/tgmarinho/gobarber/tree/aula16](https://github.com/tgmarinho/gobarber/tree/aula16)
