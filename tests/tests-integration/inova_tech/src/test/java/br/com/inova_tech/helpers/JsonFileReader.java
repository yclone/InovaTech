package br.com.inova_tech.helpers;

import org.json.JSONObject;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Classe utilitária para ler arquivos JSON de teste
 * Facilita o carregamento de dados de arquivos JSON externos
 */
public class JsonFileReader {
    
    /**
     * Lê um arquivo JSON do classpath e o converte em um objeto JSONObject
     * 
     * @param fileName Nome do arquivo JSON no classpath (pasta resources)
     * @return JSONObject com os dados do arquivo
     * @throws IOException Se ocorrer um erro ao ler o arquivo
     */
    public static JSONObject readJsonFile(String fileName) throws IOException {
        try {
            // Tenta carregar o arquivo do classpath (pasta resources)
            InputStream inputStream = JsonFileReader.class.getClassLoader().getResourceAsStream(fileName);
            
            if (inputStream == null) {
                throw new IOException("Arquivo não encontrado no classpath: " + fileName);
            }
            
            // Lê todo o conteúdo do arquivo
            byte[] bytes = inputStream.readAllBytes();
            String content = new String(bytes);
            
            // Fecha o stream
            inputStream.close();
            
            // Converte a String JSON em um objeto JSONObject
            return new JSONObject(content);
            
        } catch (Exception e) {
            throw new IOException("Erro lendo arquivo JSON: " + fileName, e);
        }
    }
    
    /**
     * Lê um arquivo JSON de uma rota absoluta
     * 
     * @param absolutePath Rota absoluta do arquivo JSON
     * @return JSONObject com os dados do arquivo
     * @throws IOException Se ocorrer um erro ao ler o arquivo
     */
    public static JSONObject readJsonFileFromPath(String absolutePath) throws IOException {
        // Lê todo o conteúdo do arquivo como String
        String content = new String(Files.readAllBytes(Paths.get(absolutePath)));
        
        // Converte a String JSON em um objeto JSONObject
        return new JSONObject(content);
    }
}