## Aula 12 - Gerando o ash da senha

Quando o usuário digita a senha e envia para o controllers, queremos que seja gerado um hash para salvar a senha no banco de dados, e posteriomente quando ele for fazer login, ele digita a senha normal, e geramos um hash e comparamos com o hash que foi salvo no password_hash do banco de dados, se for igual, ok, está autenticado.

Para fazer isso precisamos de uma lib para gerar o hash do password:
```
yarn add bcryptjs
```

Bcryptjs é utilizado no model de User, criamos um campo virtual, que é utilizado para receber o password do frontend e que é hashead para através da lib bcrypt para a variável password_hash que essa sim é uma String que é persistida no banco de dados.

Fim: [https://github.com/tgmarinho/gobarber/tree/aula12](https://github.com/tgmarinho/gobarber/tree/aula12)
