<div align="center">
    <img src="./src/assets/logo.png" alt="Ride Manager Logo" />
</div>

</br>

<h3 align="center">
  A URL base da api é: https://api.ridemanager.com.br
</h3>

</br>

## 📚 Documentação:

Todos os endpoints da API foram documentados usando Swagger. Para visualizar basta acessar a URL abaixo. Lembre-se de iniciar o servidor primeiro

Local: http://localhost:3333/api-docs
Produção: https://api.ridemanager.com.br/api-docs

</br>

## 📌 Visão Geral

O projeto se trata de uma API Rest desenvolvida com Node e Express, com o objetivo de facilitar o gerenciamento de clientes, carros, especificações, categorias e aluguéis para uma empresa locadora de veículos. A aplicação foi desenvolvida utilizando os princípios do S.O.L.I.D.

## 🛠️ Funcionalidades

- Cadastro de usuários,
- Autenticação de usuários e geração de token,
- Cadastro de carros e itens relacionados ao carro como especificações e categorias,
- Realização de um aluguel e devolução do carro,
- Recuperação de senha do usuário através de e-mail,
- Storage utilizando S3 da AWS
- Deploy em EC2 AWS

## 🚀 Tecnologias utilizadas:

- Node;
- Typescript;
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
- CSVparser;
- Daysjs;
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

#### 💻 Instalação, Dependências e Executando o Projeto

1. Clone este repositório

```shell
git clone git@github.com:devictoralmeida/ride-manager-api.git
```

2. Vá até o diretório raiz do projeto
```shell
cd ride-manager-api
```

3. Instale as dependências necessárias
```shell
yarn
ou
npm install
```

4. Crie os contâiners
```shell
docker-compose up -d
```

5. Faça uma cópia do arquivo ".env.example" com o nome ".env". Algumas variáveis ​​de ambiente são essenciais para que a API funcione em produção
```shell
cp .env.example .env
```

5. Rode as migrações
```shell
npm run typeorm:run
```

7. Execute a aplicação
```shell
npm run dev
# O servidor será executado na porta 3333 (http://localhost:3333)
```

#### 💉 Rodando os testes

Nesta aplicação, são contemplados Testes Unitários e Testes de Integração utilizando o framework de testes Jest, visando garantir o correto funcionamento das funcionalidades e manter a aplicação de acordo com os requisitos.

1. Para rodar a bateria de todos os testes, utilize:
```shell
npm run test
```