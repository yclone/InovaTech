package tests.e2eTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import dto.ClienteDTO;
import helpers.ClienteRequests;
import helpers.LoadProperties;
import helpers.PropertiesUtils;
import helpers.StsToken;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import org.springframework.test.context.ContextConfiguration;

@Tag("e2e")
public class EndToEndTests extends LoadProperties {

    @Test
    void getById_postValidCliente_ReturnClienteData() throws Exception {
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

        ClienteDTO clienteResponseGet =
                given().accept(ContentType.JSON).contentType(ContentType.JSON)
                        .header("x-getnet-apikey", "1")
                        .header("x-getnet-correlationID", "1")
                        .header("Authorization", stsToken.GeraToken(PROPS))
                        .relaxedHTTPSValidation()
                        .when()
                        .get(URI.concat(ROTA_CLIENTES).concat(String.valueOf(id)))
                        .then()
                        .contentType(ContentType.JSON)
                        .extract().body().as(ClienteDTO.class);

        // VALIDACAO
        assertEquals(clienteResponsePost, clienteResponseGet);
    }
    @Test
    void getById_postValidCliente_ReturnNotEqualClienteData() throws Exception {
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
        long beforeId = id-1;

        ClienteDTO clienteResponseGet =
                given().accept(ContentType.JSON).contentType(ContentType.JSON)
                        .header("x-getnet-apikey", "1")
                        .header("x-getnet-correlationID", "1")
                        .header("Authorization", stsToken.GeraToken(PROPS))
                        .relaxedHTTPSValidation()
                        .when()
                        .get(URI.concat(ROTA_CLIENTES).concat(String.valueOf(beforeId)))
                        .then()
                        .contentType(ContentType.JSON)
                        .extract().body().as(ClienteDTO.class);

        // VALIDACAO
        assertNotEquals(clienteResponsePost, clienteResponseGet);
    }



}
