
<h1 align="center">
  RideManager - API
</h1>

</br>

<h3 align="center">
  A URL base da api é: https://api.ridemanager.com.br
</h3>

</br>

<h3 align="center">
  Acesse o link para a documentação: https://api.ridemanager.com.br/api-docs
</h3>

</br>

## Visão Geral

O projeto se trata de uma API Rest desenvolvida com Node e Express, com o objetivo de facilitar o gerenciamento de clientes, carros, especificações, categorias e aluguéis para uma empresa locadora de veículos.

### Tecnologias utilizadas:

- Node;
- Express;
- PostgreSQL;
- TypeORM;
- Docker;
- Reddis;
- AWS EC2;
- AWS S3 Storage;
- AWS SES Mail Service;
- Tsyringe;
- Zod;
- Sentry;
- Bcrypt;
- CSV parser;
- Day js;
- Jsonwebtoken;
- Multer;
- Swagger;
- Jest;
- Babel;


### Diagrama de entidades e relacionamentos

</br>
<div align="center">
  <img src="./src/assets/diagram.png" alt="Rotas da aplicação" />
</div>

#### Rodando os testes

1. Instale as bibliotecas necessárias:

```shell
npm install
```

2. Para rodar a bateria de todos os testes, utilize:
```shell
npm run test
```