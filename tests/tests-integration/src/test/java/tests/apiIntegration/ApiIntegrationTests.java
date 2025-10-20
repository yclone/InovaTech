package tests.apiIntegration;

import com.fasterxml.jackson.databind.ObjectMapper;
import dto.ClienteDTO;
import dto.EmailDTO;
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

@Tag("integration")
public class ApiIntegrationTests extends LoadProperties {


    @Test
    void post_email_returnMessage() throws Exception {
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

        String email = clienteResponsePost.getUsuario();

        EmailDTO clienteEmail = new EmailDTO().builder()
                .email(email)
                .build();

        String emailJson = new ObjectMapper().writeValueAsString(clienteEmail);

        Response emailResponsePost =
                given().accept(ContentType.JSON).contentType(ContentType.JSON)
                        .header("x-getnet-apikey", "1")
                        .header("x-getnet-correlationID", "1")
                        .header("Authorization", stsToken.GeraToken(PROPS))
                        .relaxedHTTPSValidation()
                        .when()
                        .body(emailJson)
                        .post(URI_EMAIL.concat(ROTA_MAIL))
                        .then()
                        .log().all()
                        .contentType(ContentType.JSON)
                        .extract().response();
        String response = emailResponsePost.jsonPath().getString("response");

        // VALIDACAO
        assertThat(response).isEqualTo(("Email de boas vindas enviado com sucesso para ").concat(email) + ".");
    }

    @Test
    void post_email_returnStatusCodeOK() throws Exception {
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

        String email = clienteResponsePost.getUsuario();

        EmailDTO clienteEmail = new EmailDTO().builder()
                .email(email)
                .build();

        String emailJson = new ObjectMapper().writeValueAsString(clienteEmail);

        Response resp = given().accept(ContentType.JSON).contentType(ContentType.JSON)
                .header("x-getnet-apikey", "1")
                .header("x-getnet-correlationID", "1")
                .header("Authorization", stsToken.GeraToken(PROPS))
                .relaxedHTTPSValidation()
                .when()
                .body(emailJson)
                .post(URI_EMAIL.concat(ROTA_MAIL))

                ;

        resp.then().statusCode(200);

    }
}
