package br.com.InovaTech.InovaTech.helpers;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@Data
@Configuration
@ConfigurationProperties
public class LoadProperties {

    @Value("${printgoldenticket}")
    private String printgoldenticket;

    @Value("${UrlSts}")
    private String urlSts;

    @Value("${x-getnet-flowID}")
    private String xgetnetFlowID;

    @Value("${x-getnet-correlationID}")
    private String xgetnetCorrelationID;

    @Value("${client_id}")
    private String clientId;

    @Value("${client_secret}")
    private String clientSecret;

    @Value("${useProxy}")
    private String UseProxy;

    @Value("${UrlMailing}")
    private String UrlMailing;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

}
