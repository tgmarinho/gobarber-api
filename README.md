## Aula 2

Para utilizar o `import/export` podemos utilizar o babel ou outras ferramentas, mas nesse projeto iremos utilizar `sucrase` que é bem rapido e fácil.

`yarn add sucrase nodemon -D`

Pronto agora só alterar para import/export

Entretanto, não podemos mais rodar node src/index.js para executar o projeto.

Pode ser assim: `yarn sucrase-node src/server.js`

Mas eu quero utilizar o nodemon também.

Nodemon detecta atualiação no código e renicializa o servidor.

Preciso criar um arquivo nodemon.json na raiz do projeto, com a seguinte configuração:
```
{
  "execMap": {
    "js": "sucrase-node"
  }
}
```

Lá no package.json crio um script:

````
"scripts": {
    "dev": "nodemon src/server"
  },
````

e agora posso executar o projeto com: `yarn dev`