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

// Importação para manipulação de arquivos
import java.io.IOException;

// Importação da classe helper para leitura de arquivos JSON
import br.com.inova_tech.helpers.JsonFileReader;

// Importações estáticas para sintaxe mais limpa nos testes
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Classe de testes de integração para o cadastro de clientes
 * Lê dados de teste de arquivos JSON externos
 */
public class Cadastro_FromJson_test {
    
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
     * Teste que verifica o cadastro de um novo cliente lendo dados de JSON
     * Os dados do cliente são carregados de um arquivo JSON externo
     */
    @Test
    public void testCadastroClienteFromJson() throws IOException {
        
        // ========== PREPARAÇÃO DOS DADOS ==========
        // Carrega os dados do cliente do arquivo JSON usando a classe helper
        JSONObject cliente = JsonFileReader.readJsonFile("cliente-teste.json");
        
        // Log para verificar os dados carregados (útil para debug)
        System.out.println("Dados do cliente carregados do JSON: " + cliente.toString());

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
            .statusCode(equalTo(201))             // Verifica se o status é 201 (CREATED)
            .body("PrimeiroNome", equalTo(cliente.getString("PrimeiroNome"))) // Valida que o primeiro nome coincide
            .body("UltimoNome", equalTo(cliente.getString("UltimoNome")))     // Valida que o último nome coincide
            .body("Usuario", equalTo(cliente.getString("Usuario")))           // Valida que o usuário coincide
            .log().all();                         // Registra todos os detalhes da resposta no console para debug
    }
    
    /**
     * Teste que verifica o cadastro de um cliente alternativo usando outro arquivo JSON
     * Demonstra a flexibilidade de carregar diferentes conjuntos de dados de teste
     */
    @Test
    public void testCadastroClienteAlternativo() throws IOException {
        
        // ========== PREPARAÇÃO DOS DADOS ==========
        // Carrega os dados do cliente alternativo de outro arquivo JSON usando a classe helper
        JSONObject cliente = JsonFileReader.readJsonFile("cliente-alternativo.json");
        
        // Log para verificar os dados carregados
        System.out.println("Dados do cliente alternativo carregados: " + cliente.toString());

        // ========== EXECUÇÃO DA REQUISIÇÃO ==========
        given()
            .contentType(ContentType.JSON)
            .body(cliente.toString())
        .when()
            .post("/clientes")
        .then()
            .statusCode(equalTo(201))
            .body("PrimeiroNome", equalTo(cliente.getString("PrimeiroNome")))
            .body("UltimoNome", equalTo(cliente.getString("UltimoNome")))
            .body("Usuario", equalTo(cliente.getString("Usuario")))
            .body("Estado", equalTo(cliente.getString("Estado")))
            .body("Cidade", equalTo(cliente.getString("Cidade")))
            .log().all();
    }   
}