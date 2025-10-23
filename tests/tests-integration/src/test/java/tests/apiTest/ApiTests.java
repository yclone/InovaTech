package tests.apiTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import dto.ClienteDTO;
import helpers.ClienteRequests;
import helpers.LoadProperties;
import helpers.StsToken;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.apache.http.HttpStatus;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

@Tag("api")
public class ApiTests extends LoadProperties {

    @Test
    public void post_validClient_returnStatusCodeCreated() throws Exception {
        StsToken stsToken =  new StsToken();
        // PREPARACAO
        ClienteDTO cliente = ClienteRequests.clienteGenatare();
        String clienteJson = new ObjectMapper().writeValueAsString(cliente);

        // EXECUCAO
        given().accept(ContentType.JSON).contentType(ContentType.JSON)
                .header("x-getnet-apikey", "1")
                .header("x-getnet-correlationID", "1")
                .header("Authorization", stsToken.GeraToken(PROPS))
                .relaxedHTTPSValidation()
                .body(clienteJson)
                .when()
                .post(URI.concat(ROTA_CLIENTES))
                .then()
                // VALIDACAO
                .statusCode(HttpStatus.SC_CREATED);
    }

    @Test
    public void post_alreadyCreatedClient_returnStatusCodeBadRequest() throws Exception {
        StsToken stsToken =  new StsToken();
        // PREPARACAO
        ClienteDTO cliente = new ClienteDTO().builder()
                .primeiroNome("Paulo")
                .ultimoNome("Jorge")
                .usuario("paulo.jorge@eamil.com")
                .cidade("Sao Paulo")
                .estado("SP")
                .build();

        String clienteJson = new ObjectMapper().writeValueAsString(cliente);

        // EXECUCAO
        given().accept(ContentType.JSON).contentType(ContentType.JSON)
                .header("x-getnet-apikey", "1")
                .header("x-getnet-correlationID", "1")
                .header("Authorization", stsToken.GeraToken(PROPS))
                .relaxedHTTPSValidation()
                .body(clienteJson)
                .when()
                .post(URI.concat(ROTA_CLIENTES));
        Response responsePost =
                given().accept(ContentType.JSON).contentType(ContentType.JSON)
                        .header("x-getnet-apikey", "1")
                        .header("x-getnet-correlationID", "1")
                        .header("Authorization", stsToken.GeraToken(PROPS))
                        .relaxedHTTPSValidation()
                        .body(clienteJson)
                        .when()
                        .post(URI.concat(ROTA_CLIENTES))
                        .then()
                        .log().all()
                        // VALIDACAO
                        .statusCode(HttpStatus.SC_BAD_REQUEST)
                        .extract().response();

        String response = responsePost.jsonPath().getString("errors");

        // VALIDACAO
        assertThat(response).contains("Cliente já cadastrado!");
    }

    @Test
    public void post_invalidClient_returnStatusCodeBadRequest() {
        StsToken stsToken =  new StsToken();
        // PREPARACAO
        ClienteDTO clienteToPost = new ClienteDTO();

        // EXECUCAO
        Response responsePost =
                given().accept(ContentType.JSON).contentType(ContentType.JSON)
                        .header("x-getnet-apikey", "1")
                        .header("x-getnet-correlationID", "1")
                        .header("Authorization", stsToken.GeraToken(PROPS))
                        .relaxedHTTPSValidation()
                        .body(clienteToPost)
                        .when()
                        .post(URI.concat(ROTA_CLIENTES))
                        .then()
                        // VALIDACAO
                        .statusCode(HttpStatus.SC_BAD_REQUEST)
                        .extract().response();
        String response = responsePost.jsonPath().getString("errors");

        // VALIDACAO
        assertThat(response).contains("O nome é obrigatório");
        assertThat(response).contains("O sobrenome é obrigatório");
        assertThat(response).contains("O e-mail é obrigatório");
        assertThat(response).contains("O Estado é obrigatório");
        assertThat(response).contains("A cidade é obrigatória");
    }

    @Test
    public void post_invalidClientUser_returnStatusCodeBadRequest() throws Exception {
        StsToken stsToken =  new StsToken();
        // PREPARACAO
        ClienteDTO cliente = new ClienteDTO().builder()
                .primeiroNome("Paulo")
                .ultimoNome("Jorge")
                .usuario("paulo.jorge")
                .cidade("Sao Paulo")
                .estado("SP")
                .build();

        String clienteJson = new ObjectMapper().writeValueAsString(cliente);

        // EXECUCAO
        Response responsePost =
                given().accept(ContentType.JSON).contentType(ContentType.JSON)
                        .header("x-getnet-apikey", "1")
                        .header("x-getnet-correlationID", "1")
                        .header("Authorization", stsToken.GeraToken(PROPS))
                        .relaxedHTTPSValidation()
                        .body(clienteJson)
                        .when()
                        .post(URI.concat(ROTA_CLIENTES))
                        .then()
                        .log().all()
                        // VALIDACAO
                        .statusCode(HttpStatus.SC_BAD_REQUEST)
                        .extract().response();
        String response = responsePost.jsonPath().getString("errors");

        // VALIDACAO
        assertThat(response).contains("Formato de e-mail incorreto");
    }

    @Test
    public void get_clienteList_returnStatusCodeOK() {
        StsToken stsToken =  new StsToken();
        // EXECUCAO
        given().accept(ContentType.JSON).contentType(ContentType.JSON)
                .header("x-getnet-apikey", "1")
                .header("x-getnet-correlationID", "1")
                .header("Authorization", stsToken.GeraToken(PROPS))
                .relaxedHTTPSValidation()
                .when()
                .get(URI.concat(ROTA_CLIENTES))
                .then()
                // VALIDACAO
                .statusCode(HttpStatus.SC_OK);
    }

    @Test
    public void get_clienteList_returnStatusCodeBadRequest() {
        StsToken stsToken =  new StsToken();
        // EXECUCAO
        given().accept(ContentType.JSON).contentType(ContentType.JSON)
                .relaxedHTTPSValidation()
                .when()
                .get(URI.concat(ROTA_CLIENTES))
                .then()
                // VALIDACAO
                .statusCode(HttpStatus.SC_UNAUTHORIZED);
    }

    @Test
    public void get_clienteById_returnStatusCodeNotFound() {
        StsToken stsToken =  new StsToken();
        // EXECUCAO
        given().accept(ContentType.JSON).contentType(ContentType.JSON)
                .header("x-getnet-apikey", "1")
                .header("x-getnet-correlationID", "1")
                .header("Authorization", stsToken.GeraToken(PROPS))
                .relaxedHTTPSValidation()
                .when()
                .get(URI.concat(ROTA_CLIENTES).concat(String.valueOf(0)))
                .then()
                // VALIDACAO
                .statusCode(HttpStatus.SC_NOT_FOUND);
    }

    @Test
    public void get_clienteById_returnStatusCodeOk() throws Exception {
        StsToken stsToken =  new StsToken();
        // PREPARACAO
        ClienteDTO cliente = ClienteRequests.clienteGenatare();
        String clienteJson = new ObjectMapper().writeValueAsString(cliente);

        // EXECUCAO
        ClienteDTO clienteResponsePost =
                given().accept(ContentType.JSON).contentType(ContentType.JSON)
                        .header("x-getnet-apikey", "1")
                        .header("x-getnet-correlationID", "1")
                        .header("Authorization", stsToken.GeraToken(PROPS))
                        .relaxedHTTPSValidation()
                        .body(clienteJson)
                        .when()
                        .post(URI.concat(ROTA_CLIENTES))
                        .then()
                        .contentType(ContentType.JSON)
                        .extract().body().as(ClienteDTO.class);

        long id = clienteResponsePost.getId();

        given().accept(ContentType.JSON).contentType(ContentType.JSON)
                .header("x-getnet-apikey", "1")
                .header("x-getnet-correlationID", "1")
                .header("Authorization", stsToken.GeraToken(PROPS))
                .relaxedHTTPSValidation()
                .when()
                .get(URI.concat(ROTA_CLIENTES).concat(String.valueOf(id)))
                .then()
                // VALIDACAO
                .statusCode(HttpStatus.SC_OK);

    }
}