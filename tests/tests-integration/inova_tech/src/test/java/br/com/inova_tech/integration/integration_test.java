package br.com.inova_tech.integration;

import org.junit.jupiter.api.Test;
import com.github.javafaker.Faker;

import io.restassured.response.Response;

import org.json.JSONObject;

import static io.restassured.RestAssured.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class integration_test {

    @Test
    public void testCadastro() {
        Faker faker = new Faker();        
        // Gera dados randomicos usando Faker
        String emailRandomico = faker.name().firstName() + "." + 
                               faker.name().lastName() + 
                               "@email.com.br";
        
        JSONObject cliente = new JSONObject();
        cliente.put("PrimeiroNome", "primeiroNome");
        cliente.put("UltimoNome", "ultimoNome");
        cliente.put("Usuario", emailRandomico);
        cliente.put("Senha", "SenhaForte123!");
        cliente.put("Estado", "SP");
        cliente.put("Cidade", "São Paulo");

        Response resp = given()
            .header("Content-Type", "application/json")
            .body(cliente.toString())
        .when()
            .post("http://localhost:5000/clientes");

        // Verifica se o status code é 201 (Created)
        resp.then().statusCode(201);
        resp.then().log().all();
        String email = resp.jsonPath().getString("Usuario");

        JSONObject clienteMailing = new JSONObject();
        clienteMailing.put("Email", email);

        Response respemail = given()
            .header("Content-Type", "application/json")
            .body(clienteMailing.toString())
        .when()
            .post("http://localhost:5000/mailing");

        String resposta = respemail.jsonPath().getString("Mensagem");
        assertEquals(resposta, "Email enviado com sucesso!");
    }
    
}
