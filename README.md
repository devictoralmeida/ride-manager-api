## Cadastro de carro

**Requisitos Funcionais**

- Deve ser possível cadastrar um novo carro.

**Regras De Negócio**

- Não deve ser possível cadastrar um carro com uma placa já existente.
- O carro deve ser cadastrado com disponibilidade, por padrão.
- O usuário responsável pelo cadastro deve ser um administrador.

## Listagem de carros

**Requisitos Funcionais**

- Deve ser possível listar todos os carros disponíveis.
- Deve ser possível listar todos os carros disponíveis pelo nome do carro.
- Deve ser possível listar todos os carros disponíveis pelo nome da categoria.
- Deve ser possível listar todos os carros disponíveis pelo nome da marca.

**Regras De Negócio**

- O usuário não precisa estar logado no sistema para listar os carros.

## Cadastro de Especificação do Carro

**Requisitos Funcionais**

- Deve ser possível cadastrar uma especificação para um carro.
- Deve ser possível listar todas as especificações.
- Deve ser possível listar todos os carros.

**Regras De Negócio**

- Não deve ser possível cadastrar uma especificação para um carro não cadastrado previamente.
- Não deve ser possível cadastrar uma especificação já existente para o mesmo carro.
- O usuário responsável pelo cadastro deve ser um administrador.

## Cadastro de Imagens do Carro

**Requisitos Funcionais**

- Deve ser possível cadastrar a imagem para um carro.
- Deve ser possível listar todos os carros (disponívels ou não).

**Requisitos Não Funcionais**

- Utilizar o multar para upload dos arquivos

**Regras De Negócio**

- O usuário deve poder cadastrar mais de uma imagem para o mesmo carro.
- O usuário responsável pelo cadastro deve ser um administrador.

## Aluguel de Carro

**Requisitos Funcionais**

- Deve ser possível cadastrar um aluguel
- Deve ser possível listar todos os carros (disponívels ou não).

**Requisitos Não Funcionais**

- Utilizar o multar para upload dos arquivos

**Regras De Negócio**

- O aluguel deve ter duração mínima de 24 horas.
- Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário.
- Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo carro.
