
## Aula 5 - Sequelize & MVC

Sequelize é um [ORM](https://pt.wikipedia.org/wiki/Mapeamento_objeto-relacional) (Object-relational mapping), basicamente ele faz o mapeamento dos objetos como entidade no banco de dados.
Os bancos de dados tem um conceito de Entidade, Tabelas, Atributos, e a aplicação tem o conceito de Objetos, Atributos ou propriedades e métodos ou função. O que o ORM faz é mapear o objeto, criando uma tabela e os atributos mapeando para campos do banco de dados.
O Sequelize também ajuda a fazer as consultas do banco de dados, em vez de usar SQL nativo, podemos usar objetos com seus respectivos métodos, e escrevar javascript para fazer operações de CRUD persistência no BD.

As tabelas do banco de dados se transformam em Models (MVC)

no banco de dados temos:

users, products, productsItem 

e no no JS teremos Users.js, Products.js, ProductsItem.js.

Diferença entre SQL e SequelizeSQL:

SQL:
```
INSERT INTO users (name, email) VALUES ("Thiago Marinho", "tgmarinho@gmail.com")
```
```
SELECT * FROM users WHERE email = "tgmarinho@gmail.com" LIMIT 1
```

Sequelize:
```
User.create({ name: 'Diego Fernandes' , email: 'diego@rocketseat.com.br' , })
```
```
User.findOne({ where: { email: 'tgmarinho@gmail.com' } })
```

###  No Sequelize temos também as Migrations:

- Controle de versão para base de dados:
	- Cada alteracão na tabela como adição, remoção de campos ou criação de novas tabelas, é nas migrations que criamos a a estrutura. É um controlador de versão mesmo, pode fazer roolback para desfazer alguma coisa, no banco de dados fica um registro de versão de cada migration que é executada.
- Cada arquivo contém instruções para criação, alteração ou remoção de
tabelas ou colunas;
- Mantém a base atualizada entre todos desenvolvedores do time e também
no ambiente de produção;
- Cada arquivo é uma migration e sua ordenação ocorre por data;

Exemplo de Migration:

```
module.exports = {
    up: (queryInterface, Sequelize) != {
        return queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            email: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING
            }
        })
    },
    down: (queryInterface, Sequelize) != {
        return queryInterface.dropTable('users')
    }
}
```
[https://sequelize.org/master/manual/migrations.html](https://sequelize.org/master/manual/migrations.html)

Obs:

- É possível desfazer uma migração se errarmos algo enquanto estivermos
desenvolvendo a feature;
- Depois que a migration foi enviada para outros devs ou para ambiente de
produção ela JAMAIS poderá ser alterada, uma nova deve ser criada;
- Cada migration deve realizar alterações em apenas uma tabela, você pode
criar várias migrations para alterações maiores;

### Temos também os Seeds
• População da base de dados para desenvolvimento:
	- Podemos utilizar ele para gerar dados em tempo de execução do projeto, quando subimos o projeto ele cria dados fake.
• Muito utilizado para popular dados para testes;
• Executável apenas por código;
• Jamais será utilizado em produção;
	- A ideia aqui é usar apenas os dados fake, para testar o fluxo do sistema e também performance de listas, etc, tem várias libs em JS que geram dados fake que pode ser usado nos Seeds.
• Caso sejam dados que precisam ir para produção, a própria migration
pode manipular dados das tabelas;
	- Os dados que vão para produção devem estar nas Migrations e não no Seed.

## Arquitetura MVC

Model, View, Controller é um arquitetura bem antiga e utilizado nos dias de hoje, onde:

M = Model = Código da estrutura do banco de dados utilizando ORM ou não;
V = View = Código HTML, CSS, JS, JSX, código de criação e manipulação das telas do site/app;
C = Controller = Código JS, que contém a lógica do negócio, é o intermédiário entre o Model e a View

```M <-> C <-> V```

A View faz a requisição, o Controller recebe, processa, chama o banco de dados(Model) o banco retorna para o Controller e repassa para a View a resposta, a qual é renderizada para o usuário.

Exemplo de um Controller:
```
class UserController {
 index() { } !/ Listagem de usuários
 show() { } !/ Exibir um único usuário
 store() { } !/ Cadastrar usuário
 update() { } !/ Alterar usuário