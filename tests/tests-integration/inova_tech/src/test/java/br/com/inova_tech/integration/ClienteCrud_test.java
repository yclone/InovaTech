package br.com.inova_tech.integration;

import com.github.javafaker.Faker;

import io.restassured.response.Response;

import org.json.JSONObject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.lessThanOrEqualTo;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Tag("integration")
@Tag("api")
@Tag("e2e")
@DisplayName("CRUD e listagem paginada de clientes")
public class ClienteCrud_test {

    private static final String BASE_URL = System.getProperty("api.baseUrl", "http://localhost:5000");
    private static final String CLIENTES_URL = BASE_URL + "/clientes";
    private static final long ID_INEXISTENTE = 999999L;

    private final Faker faker = new Faker();

    private JSONObject novoClienteJson() {
        String primeiroNome = faker.name().firstName();
        String ultimoNome = faker.name().lastName();

        JSONObject cliente = new JSONObject();
        cliente.put("PrimeiroNome", primeiroNome);
        cliente.put("UltimoNome", ultimoNome);
        cliente.put("Usuario", primeiroNome.toLowerCase() + "." + ultimoNome.toLowerCase() + "."
                + faker.number().digits(6) + "@email.com.br");
        cliente.put("Senha", "SenhaForte123!");
        cliente.put("Estado", "SP");
        cliente.put("Cidade", "São Paulo");
        return cliente;
    }

    private int criarCliente(JSONObject cliente) {
        Response resposta = given()
                .header("Content-Type", "application/json")
                .body(cliente.toString())
            .when()
                .post(CLIENTES_URL);

        resposta.then().statusCode(201);
        return resposta.jsonPath().getInt("id");
    }

    @Test
    @DisplayName("PUT /clientes/{id} deve atualizar todos os dados do cliente")
    public void deveAtualizarClienteComSucesso() {
        int id = criarCliente(novoClienteJson());

        JSONObject atualizacao = novoClienteJson();
        atualizacao.put("Cidade", "Campinas");
        atualizacao.put("Estado", "SP");

        given()
            .header("Content-Type", "application/json")
            .body(atualizacao.toString())
        .when()
            .put(CLIENTES_URL + "/" + id)
        .then()
            .statusCode(200)
            .body("id", equalTo(id))
            .body("PrimeiroNome", equalTo(atualizacao.getString("PrimeiroNome")))
            .body("Usuario", equalTo(atualizacao.getString("Usuario")))
            .body("Cidade", equalTo("Campinas"))
            .body("Senha", nullValue());
    }

    @Test
    @DisplayName("PUT /clientes/{id} deve retornar 404 para cliente inexistente")
    public void deveRetornar404AoAtualizarClienteInexistente() {
        given()
            .header("Content-Type", "application/json")
            .body(novoClienteJson().toString())
        .when()
            .put(CLIENTES_URL + "/" + ID_INEXISTENTE)
        .then()
            .statusCode(404);
    }

    @Test
    @DisplayName("PATCH /clientes/{id} deve atualizar apenas os campos informados")
    public void deveAtualizarParcialmenteCliente() {
        JSONObject cliente = novoClienteJson();
        int id = criarCliente(cliente);

        given()
            .header("Content-Type", "application/json")
            .body(new JSONObject().put("Cidade", "Santos").toString())
        .when()
            .patch(CLIENTES_URL + "/" + id)
        .then()
            .statusCode(200)
            .body("Cidade", equalTo("Santos"))
            .body("Usuario", equalTo(cliente.getString("Usuario")))
            .body("PrimeiroNome", equalTo(cliente.getString("PrimeiroNome")))
            .body("Senha", nullValue());
    }

    @Test
    @DisplayName("PATCH /clientes/{id} deve retornar 404 para cliente inexistente")
    public void deveRetornar404AoAtualizarParcialmenteClienteInexistente() {
        given()
            .header("Content-Type", "application/json")
            .body(new JSONObject().put("Cidade", "Santos").toString())
        .when()
            .patch(CLIENTES_URL + "/" + ID_INEXISTENTE)
        .then()
            .statusCode(404);
    }

    @Test
    @DisplayName("DELETE /clientes/{id} deve excluir o cliente e retornar 404 na segunda chamada")
    public void deveExcluirClienteEValidarIdempotencia() {
        int id = criarCliente(novoClienteJson());

        given()
        .when()
            .delete(CLIENTES_URL + "/" + id)
        .then()
            .statusCode(204);

        given()
        .when()
            .get(CLIENTES_URL + "/" + id)
        .then()
            .statusCode(404);

        given()
        .when()
            .delete(CLIENTES_URL + "/" + id)
        .then()
            .statusCode(404);
    }

    @Test
    @DisplayName("GET /clientes deve respeitar o contrato paginado e o tamanho da página")
    public void deveListarClientesPaginados() {
        criarCliente(novoClienteJson());
        criarCliente(novoClienteJson());

        Response resposta = given()
                .queryParam("page", 0)
                .queryParam("size", 2)
            .when()
                .get(CLIENTES_URL);

        resposta.then()
            .statusCode(200)
            .body("size", equalTo(2))
            .body("number", equalTo(0))
            .body("content.size()", lessThanOrEqualTo(2))
            .body("content.Senha", everyItem(nullValue()));

        assertTrue(resposta.jsonPath().getInt("totalElements") >= 2,
                "A listagem deve conter os clientes criados no cenário");
    }

    @Test
    @DisplayName("GET /clientes deve ordenar os resultados pelo campo informado")
    public void deveOrdenarClientesPeloPrimeiroNome() {
        criarCliente(novoClienteJson());
        criarCliente(novoClienteJson());

        Response resposta = given()
                .queryParam("page", 0)
                .queryParam("size", 50)
                .queryParam("sort", "primeiroNome,asc")
            .when()
                .get(CLIENTES_URL);

        resposta.then().statusCode(200);

        java.util.List<String> nomes = resposta.jsonPath().getList("content.PrimeiroNome", String.class);
        java.util.List<String> ordenados = new java.util.ArrayList<>(nomes);
        ordenados.sort(String.CASE_INSENSITIVE_ORDER);

        assertEquals(ordenados, nomes, "A página deve vir ordenada por primeiroNome ascendente");
    }

    @Test
    @DisplayName("GET /clientes deve filtrar clientes por cidade e estado")
    public void deveFiltrarClientesPorCidadeEEstado() {
        JSONObject cliente = novoClienteJson();
        cliente.put("Cidade", "Curitiba");
        cliente.put("Estado", "PR");
        criarCliente(cliente);

        given()
            .queryParam("cidade", "curitiba")
            .queryParam("estado", "PR")
            .queryParam("size", 50)
        .when()
            .get(CLIENTES_URL)
        .then()
            .statusCode(200)
            .body("content.Cidade", everyItem(equalTo("Curitiba")))
            .body("content.Estado", everyItem(equalTo("PR")));
    }
}
