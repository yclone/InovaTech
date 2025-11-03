package br.com.inova_tech.integration;

import org.junit.jupiter.api.Test;
import com.github.javafaker.Faker;
import org.json.JSONObject;
import java.util.UUID;

import static io.restassured.RestAssured.*;

public class Cadastro_test {
    
    @Test
    public void testCadastro() {
        Faker faker = new Faker();
        // Gera um UUID único para criar um email randomico
        String randomUUID = UUID.randomUUID().toString().substring(0, 8);
        
        // Gera dados randomicos usando Faker
        String primeiroNome = faker.name().firstName();
        String ultimoNome = faker.name().lastName();
        String emailRandomico = primeiroNome.toLowerCase() + "." + 
                               ultimoNome.toLowerCase() + 
                               "@email.com.br";
        
        JSONObject cliente = new JSONObject();
        cliente.put("PrimeiroNome", primeiroNome);
        cliente.put("UltimoNome", ultimoNome);
        cliente.put("Usuario", emailRandomico);
        cliente.put("Senha", faker.internet().password(8, 16));
        cliente.put("Estado", faker.address().stateAbbr());
        cliente.put("Cidade", faker.address().city()); 

        // Para converter em String JSON:
        String jsonString = cliente.toString();
        
        // Logs para acompanhar os dados gerados
        System.out.println("=== DADOS GERADOS PARA O TESTE ===");
        System.out.println("Nome: " + primeiroNome + " " + ultimoNome);
        System.out.println("Email: " + emailRandomico);
        System.out.println("JSON completo: " + jsonString);
        System.out.println("=====================================");

        given()
            .header("Content-Type", "application/json")
            .body(jsonString)
        .when()
            .post("http://localhost:5000/clientes")
        .then()
            .statusCode(201);
    }
}
