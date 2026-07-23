# language: pt
Funcionalidade: Login de Usuário
  Como um usuário do sistema
  Eu quero fazer login na aplicação
  Para acessar minhas funcionalidades

  Contexto:
    Dado que estou na página de login

  @smoke @login
  Cenário: Login com credenciais válidas
    Quando eu preencho o campo usuário com "admin"
    E eu preencho o campo senha com "admin123"
    E eu clico no botão de login
    Então eu devo ser redirecionado para a página inicial
    E devo ver a mensagem de boas-vindas com "admin"

  @login @negative
  Cenário: Login com credenciais inválidas
    Quando eu preencho o campo usuário com "usuario_invalido"
    E eu preencho o campo senha com "senha_invalida"
    E eu clico no botão de login
    Então eu devo ver uma mensagem de erro
    E devo permanecer na página de login

  @login @negative
  Cenário: Login com campos vazios
    Quando eu clico no botão de login
    Então eu devo ver uma mensagem de erro
    E o campo usuário deve estar destacado com erro
    E o campo senha deve estar destacado com erro

  @login
  Esquema do Cenário: Login com diferentes tipos de usuários
    Quando eu preencho o campo usuário com "<usuario>"
    E eu preencho o campo senha com "<senha>"
    E eu clico no botão de login
    Então eu devo ser redirecionado para a página inicial
    E devo ver a mensagem de boas-vindas com "<nome>"

    Exemplos:
      | usuario | senha    | nome  |
      | admin   | admin123 | admin |
      | user    | user123  | user  |

  @login
  Cenário: Logout do sistema
    Dado que estou logado com usuário "admin" e senha "admin123"
    E estou na página inicial
    Quando eu abro o menu do usuário
    E clico em logout
    Então devo ser redirecionado para a página de login
