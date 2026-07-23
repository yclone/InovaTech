# language: pt
Funcionalidade: Validação de cy.session() e Segurança
  Como um QA
  Eu quero validar que cy.session() funciona corretamente
  Para garantir performance e segurança nos testes

  @session @performance
  Cenário: Primeiro login deve criar sessão
    Quando eu faço login usando cy.session como "admin"
    Então os dados devem estar salvos no localStorage
    E devo estar na dashboard

  @session @performance
  Cenário: Segundo login deve reutilizar sessão (cache)
    Dado que já existe uma sessão ativa
    Quando eu faço login usando cy.session como "admin"
    Então o login deve ser muito rápido
    E devo estar na dashboard

  @session @api
  Cenário: Login via API com sessão
    Quando eu faço login via API usando cy.session como "admin"
    Então os dados devem estar salvos no localStorage
    E devo estar na dashboard

  @session @multi-user
  Cenário: Trocar entre diferentes usuários
    Dado que estou logado como "admin"
    Quando eu troco para o usuário "user"
    Então devo estar logado como "user"
    E os dados do usuário devem estar corretos

  @session @security
  Esquema do Cenário: Validar login com diferentes perfis
    Quando eu faço login usando cy.session como "<perfil>"
    Então devo estar autenticado como "<perfil>"
    E devo ter acesso à dashboard

    Exemplos:
      | perfil    |
      | admin     |
      | user      |
      | qa_tester |
