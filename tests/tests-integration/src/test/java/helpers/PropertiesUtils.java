package helpers;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;


@Getter
@ConfigurationProperties
public class PropertiesUtils {

    @Value("${appUrl}")
    private String appUrl;
    @Value("${appUrlEmail}")
    private String appUrlEmail;
    @Value("${useProxy}")
    private Boolean useProxy;
    @Value("${proxyUrl}")
    private String proxyUrl;
    @Value("${proxyPort}")
    private int proxyPort;
    @Value("${UrlSts}")
    private String UrlSts;

    @Value("${x-getnet-flowID}")
    private String xgetnetFlowID;

    @Value("${x-getnet-correlationID}")
    private String xgetnetCorrelationID;

    @Value("${client_id}")
    private String clientId;

    @Value("${client_secret}")
    private String clientSecret;

}
