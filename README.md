# Frontend

Desenvolvido com _Angular v18_, é a interface onde o usuário interage com o sistema do projeto.

## Camadas

_Components_ são partes modulares que juntos formam a interface, incluindo as páginas e elementos que as compõem.

_Services_ trazem as funcionalidades, permitindo que dados sejam transportados dentre todos os componentes.

_Endpoints_ tratam de realizar a comunicação com o _Backend_, acessando diversos endereços web e enviando/recebendo dados. Não conhece nada do funcionamento interno do _Backend_, apenas os endereços, os dados que aceitam, e as respostas que dão.

## Interface

Construida com elementos visuais, deve ser uma experiência fluida e de fácil entendimento para o usuário.

Seu foco é ser simples, oferecendo apenas o necessário de forma a livrar o usuário da complexidade que um sistema completo traz.

## Implementação

É necessário ter _NPM_ instalado.

O comando `npm install` instala todas as dependências de um projeto em uma pasta _node\_modules_. A pasta pode ser considerada pesada.

O comando `ng serve` inicia o servidor e indica sua porta onde fica disponível.

## Desenvolvimento

Alterações no código automaticamente atualizam o servidor e são refletidas no site. _Angular_ torna o processo bem rápido.

O comando `ng generate component NOME` gera um novo componente chamado `NOME`. O mesmo pode ser feito para `service`, `class`, `guard`, etc.

O comando `ng build` monta o projeto em arquivos HTML, CSS, e JS na pasta _/dist_ e podem ser carregados por qualquer navegador.

Enfim, o comando `ng deploy --base-href=/Frontend/` carrega o projeto para um _GitHub Page_, onde pode ser visualizado. Importante notar que, para isso, cria um novo _commit_ no repositório! Não deve ser usado levianamente.
