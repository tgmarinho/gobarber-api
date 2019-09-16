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
