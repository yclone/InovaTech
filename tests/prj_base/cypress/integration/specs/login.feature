# language: pt
Funcionalidade: Login de Usuário via API
    Como um usuário do sistema
    Eu quero fazer login na aplicação
    Para ter acesso às funcionalidades do sistema

Cenario: Login com credenciais válidas
    Dado Que defino a URL como "http://localhost:5000/login" para o caso de teste "login_valido"
    Quando Faco a requisicao na API com o metodo de solicitacao "POST" e o body abaixo:
    """
        {
        "Usuario": "api.test@test.com",
        "Senha": "Admin@123"
        }
    """
    Entao Verifico se o status code e igual a "200"
    E Verifico se o valor da resposta "Mensagem" e igual a "Login realizado com sucesso"

Cenario: valida usuarios cadastrados
    Dado Que defino a URL como "http://localhost:5000/clientes" para o caso de teste "login_valido"
    Quando Faco a requisicao na API com o metodo de solicitacao "GET"
    Entao Verifico se o status code e igual a "200"
    E Verifico se o valor da resposta "Usuario" e igual a "paulo.jorge@email.com"