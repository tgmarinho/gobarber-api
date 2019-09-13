## Aula 13 - Conceitos de JWT

Json Web Token([JWT](https://jwt.io/)) , server para fazer autenticação.

**JWT (JSON Web Token)** é um sistema de transferência de dados que pode ser enviado via POST ou em um cabeçalho HTTP (header) de maneira “segura”, essa informação é assinada digitalmente por um algoritmo HMAC, ou um par de chaves pública/privada usando RSA. ([Saiba mais...](https://imasters.com.br/desenvolvimento/json-web-token-conhecendo-o-jwt-na-teoria-e-na-pratica))

Gera um token com headers (tipo de token, algoritmo), Payload (Dados adicionais) e Assinatura ( o que garante a veracidade do token, não pode ser modificado)
