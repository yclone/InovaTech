package br.com.InovaTech.InovaTech.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:5001}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        Server server = new Server();
        server.setUrl("http://localhost:" + serverPort);
        server.setDescription("Servidor de Desenvolvimento");

        Contact contact = new Contact();
        contact.setName("InovaTech Team");
        contact.setEmail("contato@inovatech.com.br");

        License license = new License();
        license.setName("MIT License");
        license.setUrl("https://opensource.org/licenses/MIT");

        Info info = new Info()
                .title("InovaTech API")
                .version("1.0.0")
                .description("API para gestão de clientes - Projeto InovaTech\n\n" +
                        "Esta API fornece endpoints para criar, listar e consultar clientes, " +
                        "com validações completas e integração com banco de dados H2.")
                .contact(contact)
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(server));
    }
}