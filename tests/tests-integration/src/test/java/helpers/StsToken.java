package helpers;

import io.restassured.RestAssured;
import io.restassured.path.json.JsonPath;
import io.restassured.path.json.exception.JsonPathException;
import io.restassured.specification.ProxySpecification;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.useRelaxedHTTPSValidation;

public class StsToken {

    public StsToken(){};

    public String GeraToken(PropertiesUtils props) {
        JsonPath resp = null;
        useRelaxedHTTPSValidation();
        if(props.getUseProxy()){
            String proxyUrl = "proxyad.getnet";
            int proxyPort = 8080;
            RestAssured.proxy = ProxySpecification.host(proxyUrl).withPort(proxyPort);
        }

        try {
            resp = given().
                    header("Content-Type", "application/x-www-form-urlencoded").
                    header("x-getnet-flowID", props.getXgetnetFlowID()).
                    header("x-getnet-correlationID", props.getXgetnetCorrelationID()).
                    formParam("grant_type", "client_credentials").
                    formParam("client_secret", props.getClientSecret()).
                    formParam("client_id", props.getClientId()).
                    when().
                    post(props.getUrlSts())
                    .jsonPath();
        } catch (JsonPathException e) {
            // TODO: handle exception
        }

        return "Bearer " + resp.getString("access_token");

    }

    @Test
    void getTokenParaTestes() {
//        System.out.println(GeraToken("https://des-sts-int.mbi.cloud.ihf/api/oauth/token"));
    }
    public void test(){

    }
}
