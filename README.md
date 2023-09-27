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

**Regras De Negócio**

- Não deve ser possível cadastrar uma especificação para um carro não cadastrado previamente.
- Não deve ser possível cadastrar uma especificação já existente para o mesmo carro.
- O usuário responsável pelo cadastro deve ser um administrador.

## Cadastro de Imagens do Carro

**Requisitos Funcionais**

- Deve ser possível cadastrar a imagem para um carro.

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
- O usuário deve estar logado na aplicação
- Ao realizar um aluguel, o status do carro deverá ser alterado para indisponível.

## Devolução de um Carro

**Requisitos Funcionais**

- Deve ser possível realizar a devolução de um carro.

**Regras De Negócio**

- Se o carro for devolvido com menos de 24 horas, deverá ser cobrado uma diária completa.
- Ao realizar a devolução, o carro deverá ser liberado para outro aluguel.
- Ao realizar a devolução, o usuário deverá ser liberado para outro aluguel.
- Ao realizar a devolução, deverá ser calculado o total do aluguel.
- Caso o horário de devolução seja superior ao horário previsto de entrega, deverá ser cobrado multa proporcional aos deias de atraso.
- Caso haja multa, deverá ser somado ao total do aluguel.


## Listagem de Aluguéis para usuário

**Requisitos Funcionais**

- Deve ser possível realizar a busca de todos os alugueis para o usuário.

**Regras De Negócio**

- O usuário deve estar logado na aplicação


## Recuperação de senha

**Requisitos Funcionais**

- Deve ser possível o usuário recuperar a senha informando o e-mail
- O usuário deve receber um e-mail com o passo a passo para a recuperação da senha
- O usuário devce conseguir inserir uma nova senha

**Regras De Negócio**

- O usuário precisa informar uma nova senha
- O link enviado para a recuperação deve expirar em 3 horas

