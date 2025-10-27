package br.com.InovaTech.InovaTech.test.unitTest;

import br.com.InovaTech.InovaTech.exceptions.InternalErrorException;
import br.com.InovaTech.InovaTech.model.dto.ClienteDTO;
import br.com.InovaTech.InovaTech.model.entity.Cliente;
import br.com.InovaTech.InovaTech.service.ClienteService;
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
class
ClienteControllerTest {

	static String CLIENTE_API = "/clientes";

	@MockBean
	ClienteService service;

	@Autowired
	MockMvc mvc;

	@Autowired
	ObjectMapper objectMapper;

	@Test //OK
	@DisplayName("O metodo createCliente deve funcionar conforme o esperado ao receber um cliente valido")
	void post_NewCliente_ReturnsCreated() throws Exception {

		// PREPARACAO
		Cliente clienteToSave = ClienteMockFactory.novoClientePauloJorge();
		Cliente clienteAfterSave = ClienteMockFactory.clienteCadastradoPauloJorgeId9();

		BDDMockito.given(service.save(clienteToSave)).willReturn(clienteAfterSave);

		ClienteDTO clienteDtoToCreate = ClienteDtoMockFactory.novoClientePauloJorge();
		ClienteDTO expectedResult = ClienteDtoMockFactory.clienteCadastradoPauloJorgeId9();

		String json = objectMapper.writeValueAsString(clienteDtoToCreate);

		// EXECUCAO
		MockHttpServletRequestBuilder request = MockMvcRequestBuilders.post(CLIENTE_API)
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON)
				.content(json);
		MockHttpServletResponse result = mvc.perform(request).andReturn().getResponse();

		// VALIDACAO
		assertEquals(HttpStatus.CREATED.value(), result.getStatus());

		String contentAsString = result.getContentAsString(StandardCharsets.UTF_8);
		ClienteDTO clienteResponse = objectMapper.readValue(contentAsString, ClienteDTO.class);
		assertEquals(expectedResult, clienteResponse);

		Mockito.verify(service, Mockito.times(1)).save(clienteToSave);
	}

	@Test //OK
	@DisplayName("O metodo getCliente(id) deve retornar o cliente retornado pelo service como dto")
	void getById_IdClienteCadastrado_ReturnsOk() throws Exception {

		// PREPARACAO
		Cliente cliente = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
		long clienteId = cliente.getId();

		BDDMockito.given(service.getById(clienteId)).willReturn(Optional.of(cliente));

		ClienteDTO expectedResult = ClienteDtoMockFactory.clienteCadastradoPauloJorgeId9();

		// EXECUCAO
		MockHttpServletRequestBuilder request = MockMvcRequestBuilders.get(CLIENTE_API.concat("/" + clienteId))
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON);

		MockHttpServletResponse result = mvc.perform(request).andReturn().getResponse();

		// VALIDACAO
		assertEquals(HttpStatus.OK.value(), result.getStatus());

		String contentAsString = result.getContentAsString(StandardCharsets.UTF_8);
		ClienteDTO clienteResponse = objectMapper.readValue(contentAsString, ClienteDTO.class);
		assertEquals(expectedResult, clienteResponse);

		Mockito.verify(service, Mockito.times(1)).getById(clienteId);
	}

	@Test//OK
	@DisplayName("O metodo getCliente() deve retornar a lista de clientes retornadas pelo serive como dtos")
	void getByAll_AllClientesCadastrados_ReturnsOK() throws Exception {

		// PREPARACAO
		Cliente[] clienteList = { ClienteMockFactory.clienteCadastradoPauloJorgeId9(), ClienteMockFactory.clienteCadastradoMrDevopsId10() };

		BDDMockito.given(service.getList()).willReturn(Arrays.asList(clienteList));

		ClienteDTO[] expectedClientesDto = { ClienteDtoMockFactory.clienteCadastradoPauloJorgeId9(), ClienteDtoMockFactory.clienteCadastradoMrDevopsId10() };

		// EXECUCAO
		MockHttpServletRequestBuilder request = MockMvcRequestBuilders.get(CLIENTE_API)
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON);

		MockHttpServletResponse result = mvc.perform(request).andReturn().getResponse();

		// VALIDACAO
		assertEquals(HttpStatus.OK.value(), result.getStatus());

		String contentAsString = result.getContentAsString(StandardCharsets.UTF_8);
		ClienteDTO[] clientesDtoResponse = objectMapper.readValue(contentAsString, ClienteDTO[].class);

		assertTrue(Arrays.equals(expectedClientesDto, clientesDtoResponse));

		Mockito.verify(service, Mockito.times(1)).getList();
	}

	@Test//OK
	@DisplayName("O metodo createCliente deve retornar erro ao tentar cadastrar um cliente tendo o banco de dados offline")
	void post_WithInternalErrorException_ThrowsException_thenStatusCode500() throws Exception {
		// PREPARACAO
		Cliente clienteToSave = ClienteMockFactory.novoClientePauloJorge();

		BDDMockito.given(service.save(clienteToSave)).willThrow(new InternalErrorException("Erro ao acessar o banco de dados", new JpaSystemException(new RuntimeException("Database is offline"))));

		ClienteDTO clienteDto = ClienteDtoMockFactory.novoClientePauloJorge();

		String json = objectMapper.writeValueAsString(clienteDto);

		// EXECUCAO
		MockHttpServletRequestBuilder request = MockMvcRequestBuilders.post(CLIENTE_API)
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON)
				.content(json);
		ResultActions result = mvc.perform(request);

		// VALIDACAO
		result	.andExpect(status().isInternalServerError())
				.andExpect(jsonPath("errors[0]", equalTo("Erro ao acessar o banco de dados")));

		Mockito.verify(service, Mockito.times(1)).save(clienteToSave);
	}

	@Test//OK
	@DisplayName("O metodo getCliente() deve retornar erro ao tentar retornar a lista de clientes tendo o banco de dados offline")
	void getAll_ComInternalErrorException_ThrowsException_thenStatusCode500() throws Exception {

		// PREPARACAO
		BDDMockito.given(service.getList()).willThrow(new InternalErrorException("Erro ao acessar o banco de dados", new JpaSystemException(new RuntimeException("Database is offline"))));

		// EXECUCAO
		MockHttpServletRequestBuilder request = MockMvcRequestBuilders.get(CLIENTE_API)
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON);

		ResultActions result = mvc.perform(request);

		// VALIDACAO
		result	.andExpect(status().isInternalServerError())
				.andExpect(jsonPath("errors[0]", equalTo("Erro ao acessar o banco de dados")));

		Mockito.verify(service, Mockito.times(1)).getList();
	}

	@Test//OK
	@DisplayName("O metodo getCliente(id) deve retornar erro ao tentar retornar um cliente pelo id tendo o banco de dados offline")
	void getById_WithInternalErrorException_ThrowsException_thenStatusCode500() throws Exception {

		// PREPARACAO
		long clienteId = 1;
		BDDMockito.given(service.getById(clienteId)).willThrow(new InternalErrorException("Erro ao acessar o banco de dados", new JpaSystemException(new RuntimeException("Database is offline"))));

		// EXECUCAO
		MockHttpServletRequestBuilder request = MockMvcRequestBuilders.get(CLIENTE_API.concat("/" + clienteId))
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON);

		ResultActions result = mvc.perform(request);

		// VALIDACAO
		result	.andExpect(status().isInternalServerError())
				.andExpect(jsonPath("errors[0]", equalTo("Erro ao acessar o banco de dados")));

		Mockito.verify(service, Mockito.times(1)).getById(clienteId);
	}

}
