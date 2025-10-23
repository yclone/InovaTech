package helpers;

import io.restassured.path.json.JsonPath;

import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * STS Token Fake para testes de integração
 * Simula o comportamento do STS real sem depender de serviços externos
 */
public class StsTokenFake {

    public StsTokenFake() {}

    /**
     * Gera um token fake válido para testes
     * Simula a resposta do STS real com um token Bearer válido
     */
    public String geraToken(PropertiesUtils props) {
        // Simula o comportamento do STS real
        Map<String, Object> tokenResponse = new HashMap<>();
        
        // Gera um token JWT fake simples
        String fakeToken = generateFakeJwtToken(props);
        
        tokenResponse.put("access_token", fakeToken);
        tokenResponse.put("token_type", "Bearer");
        tokenResponse.put("expires_in", 3600); // 1 hora
        tokenResponse.put("scope", "client_credentials");
        
        return "Bearer " + fakeToken;
    }

    /**
     * Gera um token JWT fake para testes
     * Não é um JWT válido real, mas serve para os testes
     */
    private String generateFakeJwtToken(PropertiesUtils props) {
        // Header JWT fake
        Map<String, String> header = new HashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");
        
        // Payload JWT fake
        Map<String, Object> payload = new HashMap<>();
        payload.put("sub", props != null ? props.getClientId() : "test-client");
        payload.put("aud", "api");
        payload.put("iss", "fake-sts");
        payload.put("exp", Instant.now().getEpochSecond() + 3600); // expira em 1 hora
        payload.put("iat", Instant.now().getEpochSecond());
        payload.put("jti", UUID.randomUUID().toString());
        payload.put("scope", "read write");
        
        // Simula a estrutura de um JWT (header.payload.signature)
        String headerEncoded = Base64.getEncoder().encodeToString(header.toString().getBytes());
        String payloadEncoded = Base64.getEncoder().encodeToString(payload.toString().getBytes());
        String signature = Base64.getEncoder().encodeToString("fake-signature-for-tests".getBytes());
        
        return String.format("%s.%s.%s", headerEncoded, payloadEncoded, signature);
    }

    /**
     * Método alternativo que retorna diretamente um token fixo para testes simples
     */
    public String geraTokenSimples() {
        return "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LWNsaWVudCIsImF1ZCI6ImFwaSIsImlzcyI6ImZha2Utc3RzIiwiZXhwIjoxNzI5NDM2NDAwLCJpYXQiOjE3Mjk0MzI4MDAsInNjb3BlIjoicmVhZCB3cml0ZSJ9.fake-signature-for-integration-tests";
    }

    /**
     * Verifica se deve usar o STS real ou fake baseado em configuração
     */
    public static boolean shouldUseFakeSts(PropertiesUtils props) {
        // Verifica se a URL do STS contém o domínio que não existe mais
        return props != null && props.getUrlSts() != null && 
               props.getUrlSts().contains("des-sts-int.mbi.cloud.ihf");
    }
}