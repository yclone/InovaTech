package br.com.InovaTech.InovaTech.test.unitTest;

import br.com.InovaTech.InovaTech.exceptions.InternalErrorException;
import br.com.InovaTech.InovaTech.model.dto.ClienteDTO;
import br.com.InovaTech.InovaTech.model.entity.Cliente;
import br.com.InovaTech.InovaTech.repository.ClienteRepository;
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

	@Autowired
	MockMvc mvc;

	@Autowired
	ObjectMapper objectMapper;


	@Test
	@DisplayName("O metodo createCliente deve funcionar conforme o esperado ao receber um cliente valido")
	void post_NewCliente_UsingRepositoryMock() throws Exception {

	    // PREPARACAO
		Cliente clienteToSave = ClienteMockFactory.novoClientePauloJorge();
		Cliente clienteAfterSave = ClienteMockFactory.clienteCadastradoPauloJorgeId9();

	    BDDMockito.given(repository.save(Mockito.any(Cliente.class))).willReturn(clienteAfterSave);
	    
	    // Configurar o ModelMapper mock para fazer as conversões
	    ClienteDTO clienteDtoToCreate = ClienteDtoMockFactory.novoClientePauloJorge();
		ClienteDTO expectedResult = ClienteDtoMockFactory.clienteCadastradoPauloJorgeId9();
		
		BDDMockito.given(modelMapper.map(Mockito.any(ClienteDTO.class), Mockito.eq(Cliente.class)))
		    .willReturn(clienteToSave);
		BDDMockito.given(modelMapper.map(Mockito.any(Cliente.class), Mockito.eq(ClienteDTO.class)))
		    .willReturn(expectedResult);

	    String json = objectMapper.writeValueAsString(clienteDtoToCreate);

	    // EXECUCAO
	    MockHttpServletResponse response = mvc.perform(MockMvcRequestBuilders.post(CLIENTE_API)
			.contentType(MediaType.APPLICATION_JSON)
			.content(json))
			.andReturn()
			.getResponse();

	    // VALIDACAO
	    assertEquals(HttpStatus.CREATED.value(), response.getStatus());
	    
	    String jsonResponse = response.getContentAsString(StandardCharsets.UTF_8);
	    ClienteDTO resultDto = objectMapper.readValue(jsonResponse, ClienteDTO.class);
	    
	    assertEquals("Paulo", resultDto.getPrimeiroNome());
	    assertEquals("Jorge", resultDto.getUltimoNome());
	    assertEquals("paulo.jorge@email.com.br", resultDto.getUsuario());
	    assertEquals("São Paulo", resultDto.getCidade());
	    assertEquals("SP", resultDto.getEstado());
	}

}
