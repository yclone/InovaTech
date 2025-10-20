package helpers;

import io.restassured.RestAssured;
import io.restassured.specification.ProxySpecification;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

import java.io.IOException;

@SpringBootTest
@ContextConfiguration(classes = {PropertiesUtils.class})
public class LoadProperties {

    public static String URI;
    public static String URI_EMAIL;
    public static String URI_STS;
    public static PropertiesUtils PROPS;

    public static final String ROTA_CLIENTES = "grupoa_clientes/";
    public static final String ROTA_MAIL = "emails/";

    @BeforeAll
    public static void LoadProperties(@Autowired PropertiesUtils props) throws IOException {
        PROPS = props;
        URI = props.getAppUrl();
        URI_EMAIL = props.getAppUrlEmail();
        URI_STS = props.getUrlSts();
        boolean useProxy = props.getUseProxy();

        if (useProxy) {
            String proxyUrl = "proxyad.getnet";
            int proxyPort = 8080;
            RestAssured.proxy = ProxySpecification.host(proxyUrl).withPort(proxyPort);
        }
    }
}
