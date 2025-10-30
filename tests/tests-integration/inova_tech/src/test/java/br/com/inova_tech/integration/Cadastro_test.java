// Pacote que organiza as classes de testes de integração
package br.com.inova_tech.integration;

// Importações necessárias para os testes JUnit 5
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

// Importação para manipulação de objetos JSON
import org.json.JSONObject;

// Importações do RestAssured para testes de API REST
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

// Importações estáticas para sintaxe mais limpa nos testes
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Classe de testes de integração para o cadastro de clientes
 * Utiliza RestAssured para testar endpoints REST da API
 */
public class Cadastro_test {
    
    /**
     * Método executado antes de cada teste
     * Configura as configurações globais do RestAssured
     */
    @BeforeEach
    public void setUp() {
        // Define a URL base para todos os testes desta classe
        // Evita repetir a URL completa em cada teste
        RestAssured.baseURI = "http://localhost:5000";
    }
    
    /**
     * Teste que verifica o cadastro de um novo cliente via POST
     * Simula o comportamento do comando curl fornecido
     */
    @Test
    public void testCadastroCliente() {
        
        // ========== PREPARAÇÃO DOS DADOS ==========
        // Criação do objeto JSON que será enviado no corpo da requisição
        JSONObject cliente = new JSONObject();
        
        // Adição de cada campo do cliente no objeto JSON
        // Estes dados correspondem exatamente ao curl fornecido
        cliente.put("PrimeiroNome", "Paulo");    // Nome do cliente
        cliente.put("UltimoNome", "Jorge");      // Sobrenome do cliente
        cliente.put("Usuario", "paulo.jorge@email.com");  // Email/usuário
        cliente.put("Estado", "RJ");             // Estado de residência
        cliente.put("Cidade", "123");            // Código da cidade

        // ========== EXECUÇÃO DA REQUISIÇÃO ==========
        // Uso do padrão Given-When-Then do RestAssured para estruturar o teste
        given()
            // GIVEN: Configuração da requisição
            .contentType(ContentType.JSON)        // Define o Content-Type como application/json
            .body(cliente.toString())             // Converte o objeto JSON para string e define como corpo da requisição
        .when()
            // WHEN: Execução da ação (chamada HTTP)
            .post("/clientes")                    // Faz um POST para o endpoint /clientes
        .then()
            // THEN: Validações da resposta
            .statusCode(equalTo(201))  // Verifica se o status é 200 (OK) ou 201 (Created)
            // .statusCode(anyOf(equalTo(200), equalTo(201)))  // Verifica se o status é 200 (OK) ou 201 (Created)
            .log().all();                         // Registra todos os detalhes da resposta no console para debug
    }   
 
}
