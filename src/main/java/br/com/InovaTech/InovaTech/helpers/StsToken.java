package br.com.InovaTech.InovaTech.helpers;

import io.restassured.RestAssured;
import io.restassured.path.json.JsonPath;
import io.restassured.path.json.exception.JsonPathException;
import io.restassured.specification.ProxySpecification;
import lombok.Data;
import org.json.JSONObject;

import javax.net.ssl.*;
import java.net.*;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Base64;

import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.useRelaxedHTTPSValidation;

@Data
public class StsToken {

    public String token;

    LoadProperties props;

    public  StsToken(LoadProperties props){
        this.props = props;
        try {
            GeraToken(props);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void GeraToken(LoadProperties props) {
        JsonPath resp = null;
        useRelaxedHTTPSValidation();
//        if(Boolean.parseBoolean(props.getUseProxy())){
//            String proxyUrl = "proxyad.getnet";
//            int proxyPort = 8080;
//            RestAssured.proxy = ProxySpecification.host(proxyUrl).withPort(proxyPort);
//        }

        try {
            resp = given().
                    relaxedHTTPSValidation().
                    header("Content-Type", "application/x-www-form-urlencoded").
                    header("x-getnet-flowID", props.getXgetnetFlowID()).
                    header("x-getnet-correlationID", props.getXgetnetCorrelationID()).
                    formParam("grant_type", "client_credentials").
                    formParam("client_secret", props.getClientSecret()).
                    formParam("client_id", props.getClientId()).
                    when().
                    post(props.getUrlSts())
                    .jsonPath();
            setToken("Bearer " + resp.getString("access_token"));

        } catch (JsonPathException e) {
            // TODO: handle exception
            throw new JsonPathException("erro ao gerar o Token!", e);
        }

    }
}