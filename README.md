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


Fim: [https://github.com/tgmarinho/gobarber/tree/aula30](https://github.com/tgmarinho/gobarber/tree/aula30)
