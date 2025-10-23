package helpers;

import io.restassured.RestAssured;
import io.restassured.path.json.JsonPath;
import io.restassured.path.json.exception.JsonPathException;
import io.restassured.specification.ProxySpecification;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.useRelaxedHTTPSValidation;

public class StsToken {

    private StsTokenFake stsTokenFake;

    public StsToken(){
        this.stsTokenFake = new StsTokenFake();
    };

    public String GeraToken(PropertiesUtils props) {
        // Verifica se deve usar o STS fake para evitar conexões externas
        if (StsTokenFake.shouldUseFakeSts(props)) {
            System.out.println("🔧 Usando STS Fake para testes (serviço externo não disponível)");
            return stsTokenFake.geraToken(props);
        }

        // Código original para STS real (mantido para compatibilidade)
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
        } catch (Exception e) {
            System.err.println("❌ Erro ao conectar com STS real: " + e.getMessage());
            System.out.println("🔧 Fallback para STS Fake");
            return stsTokenFake.geraToken(props);
        }

        if (resp != null) {
            return "Bearer " + resp.getString("access_token");
        } else {
            System.out.println("🔧 STS real retornou null, usando STS Fake");
            return stsTokenFake.geraToken(props);
        }

    }

    @Test
    void getTokenParaTestes() {
//        System.out.println(GeraToken("https://des-sts-int.mbi.cloud.ihf/api/oauth/token"));
    }
    public void test(){

    }
}
