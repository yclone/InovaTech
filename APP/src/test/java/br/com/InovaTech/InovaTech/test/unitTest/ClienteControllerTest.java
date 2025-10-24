package br.com.InovaTech.InovaTech.test.unitTest;

import br.com.InovaTech.InovaTech.exceptions.InternalErrorException;
import br.com.InovaTech.InovaTech.model.dto.ClienteDTO;
import br.com.InovaTech.InovaTech.model.entity.Cliente;
import br.com.InovaTech.InovaTech.repository.ClienteRepository;
import br.com.InovaTech.InovaTech.repository.MailingRepository;
import br.com.InovaTech.InovaTech.test.helpers.ClienteDtoMockFactory;
import br.com.InovaTech.InovaTech.test.helpers.ClienteMockFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Optional;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(SpringExtension.class)
@WebMvcTest
@AutoConfigureMockMvc
class ClienteControllerTest {

	static String CLIENTE_API = "/clientes";

	@MockBean
    ClienteRepository repository;
    
    @MockBean
    org.modelmapper.ModelMapper modelMapper;
    
    @MockBean
    MailingRepository mailingRepository;

	@Autowired
	MockMvc mvc;

	@Autowired
	ObjectMapper objectMapper;


	@Test
	@DisplayName("O metodo createCliente deve funcionar conforme o esperado ao receber um cliente valido")
	void post_NewCliente_UsingRepositoryMock() throws Exception {

	    // PREPARACAO
	    // Cria um objeto Cliente mock para ser usado como entrada do método save
		Cliente clienteToSave = ClienteMockFactory.novoClientePauloJorge();
		// Cria um objeto Cliente mock que simula o retorno do repository após salvar (com ID gerado)
		Cliente clienteAfterSave = ClienteMockFactory.clienteCadastradoPauloJorgeId9();

		// Configura o mock do repository.existsByUsuario para retornar false
		// Isso simula que o cliente NÃO existe no banco, permitindo o cadastro
		BDDMockito.given(repository.existsByUsuario(Mockito.anyString())).willReturn(false);
		
		// Configura o mock do repository.save para retornar o clienteAfterSave
		// Simula o comportamento do banco que adiciona um ID ao salvar
	    BDDMockito.given(repository.save(Mockito.any(Cliente.class))).willReturn(clienteAfterSave);
	    
	    // Configura o mock do mailingRepository.sendEmail para retornar null
	    // Simula o envio de email com sucesso (sem lançar exceção)
	    BDDMockito.given(mailingRepository.sendEmail(Mockito.anyString())).willReturn(null);
	    
	    // Cria um ClienteDTO que será enviado no corpo da requisição POST
	    ClienteDTO clienteDtoToCreate = ClienteDtoMockFactory.novoClientePauloJorge();
	    // Cria um ClienteDTO que representa o resultado esperado da API
		ClienteDTO expectedResult = ClienteDtoMockFactory.clienteCadastradoPauloJorgeId9();
		
		// Configura o mock do ModelMapper para converter ClienteDTO em Cliente
		// Quando o controller chamar modelMapper.map(dto, Cliente.class), retorna clienteToSave
		BDDMockito.given(modelMapper.map(Mockito.any(ClienteDTO.class), Mockito.eq(Cliente.class)))
		    .willReturn(clienteToSave);
		// Configura o mock do ModelMapper para converter Cliente em ClienteDTO
		// Quando o controller chamar modelMapper.map(entity, ClienteDTO.class), retorna expectedResult
		BDDMockito.given(modelMapper.map(Mockito.any(Cliente.class), Mockito.eq(ClienteDTO.class)))
		    .willReturn(expectedResult);

		// Converte o objeto ClienteDTO em JSON para enviar no corpo da requisição
	    String json = objectMapper.writeValueAsString(clienteDtoToCreate);

	    // EXECUCAO
	    // Executa uma requisição POST para o endpoint /clientes
	    // Define o Content-Type como JSON e envia o JSON no corpo
	    // Obtém a resposta HTTP completa (incluindo status, headers e body)
	    MockHttpServletResponse response = mvc.perform(MockMvcRequestBuilders.post(CLIENTE_API)
			.contentType(MediaType.APPLICATION_JSON)
			.content(json))
			.andReturn()
			.getResponse();

	    // VALIDACAO
	    // Verifica se o status code da resposta é 201 (CREATED)
	    assertEquals(HttpStatus.CREATED.value(), response.getStatus());
	    
	    // Extrai o corpo da resposta (JSON) como String, usando UTF-8
	    String jsonResponse = response.getContentAsString(StandardCharsets.UTF_8);
	    // Converte o JSON de resposta de volta para um objeto ClienteDTO
	    ClienteDTO resultDto = objectMapper.readValue(jsonResponse, ClienteDTO.class);
	    
	    // Valida que o primeiro nome no resultado é "Paulo"
	    assertEquals("Paulo", resultDto.getPrimeiroNome());
	    // Valida que o último nome no resultado é "Jorge"
	    assertEquals("Jorge", resultDto.getUltimoNome());
	    // Valida que o usuário (email) no resultado é "paulo.jorge@email.com.br"
	    assertEquals("paulo.jorge@email.com.br", resultDto.getUsuario());
	    // Valida que a cidade no resultado é "São Paulo"
	    assertEquals("São Paulo", resultDto.getCidade());
	    // Valida que o estado no resultado é "SP"
	    assertEquals("SP", resultDto.getEstado());
	}

}
