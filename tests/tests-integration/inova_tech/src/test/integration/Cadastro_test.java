package br.com.inova_tech.integration;

import org.junit.jupiter.api.Test;

import org.json.JSONObject;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class Cadastro_test {
    
    @Test
    public void testCadastro() {
        JSONObject pauloJorge = new JSONObject();
        pauloJorge.put("PrimeiroNome", "Paulo");
        pauloJorge.put("UltimoNome", "Jorge");
        pauloJorge.put("Usuario", "paulo.jorge@email.com.br");
        pauloJorge.put("Estado", "RJ");
        pauloJorge.put("Cidade", "123"); 

        // Para converter em String JSON:
        String jsonString = pauloJorge.toString();
        System.out.println(jsonString);
    }
}
