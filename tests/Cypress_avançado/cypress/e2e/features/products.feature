# language: pt
Funcionalidade: Gerenciamento de Produtos
  Como um administrador do sistema
  Eu quero gerenciar produtos
  Para manter o catálogo atualizado

  Contexto:
    Dado que estou logado como administrador
    E estou na página de produtos

  @smoke @products @crud
  Cenário: Adicionar novo produto
    Quando eu clico no botão de adicionar produto
    E eu preencho o formulário com os seguintes dados:
      | campo      | valor                        |
      | nome       | Notebook Dell                |
      | descrição  | Notebook i7 16GB RAM         |
      | preço      | 3500.00                      |
      | categoria  | Eletrônicos                  |
      | estoque    | 10                           |
    E eu clico no botão salvar
    Então devo ver uma mensagem de sucesso
    E o produto "Notebook Dell" deve aparecer na lista

  @products @crud
  Cenário: Editar produto existente
    Dado que existe um produto "Mouse Gamer" na lista
    Quando eu clico no botão editar do produto "Mouse Gamer"
    E eu altero o preço para "150.00"
    E eu clico no botão salvar
    Então devo ver uma mensagem de sucesso
    E o produto "Mouse Gamer" deve ter o preço "150.00"

  @products @crud
  Cenário: Excluir produto
    Dado que existe um produto "Teclado Mecânico" na lista
    Quando eu clico no botão excluir do produto "Teclado Mecânico"
    E eu confirmo a exclusão
    Então devo ver uma mensagem de sucesso
    E o produto "Teclado Mecânico" não deve aparecer na lista

  @products @negative
  Cenário: Adicionar produto sem nome
    Quando eu clico no botão de adicionar produto
    E eu preencho apenas a descrição com "Produto teste"
    E eu clico no botão salvar
    Então devo ver um erro no campo nome
    E o produto não deve ser salvo

  @products @search
  Cenário: Buscar produto por nome
    Dado que existem os seguintes produtos cadastrados:
      | nome              | preço   |
      | Mouse Gamer       | 100.00  |
      | Teclado Gamer     | 200.00  |
      | Monitor Gamer     | 1500.00 |
    Quando eu busco por "Mouse"
    Então devo ver apenas 1 produto na lista
    E o produto "Mouse Gamer" deve aparecer na lista

  @products @filter
  Cenário: Filtrar produtos por categoria
    Dado que existem produtos de diferentes categorias
    Quando eu seleciono a categoria "Eletrônicos"
    Então devo ver apenas produtos da categoria "Eletrônicos"

  @regression @products
  Esquema do Cenário: Validação de campos obrigatórios
    Quando eu clico no botão de adicionar produto
    E eu preencho o campo "<campo>" com "<valor>"
    E eu clico no botão salvar
    Então devo ver um erro indicando campo obrigatório

    Exemplos:
      | campo     | valor               |
      | nome      |                     |
      | preço     |                     |
      | descrição | Produto sem nome    |
