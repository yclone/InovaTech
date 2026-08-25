package br.com.InovaTech.InovaTech.test.unitTest;

import br.com.InovaTech.InovaTech.controller.ClienteController;
import br.com.InovaTech.InovaTech.exceptions.InternalErrorException;
import br.com.InovaTech.InovaTech.exceptions.NotFoundException;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(SpringExtension.class)
@WebMvcTest(controllers = ClienteController.class)
@AutoConfigureMockMvc(addFilters = false)
class
ClienteControllerTest {

	static String CLIENTE_API = "/clientes";

	@MockBean
	ClienteService service;

	@Autowired
	MockMvc mvc;

	@Autowired
	ObjectMapper objectMapper;

	@Test
	@DisplayName("Deve atualizar um cliente com sucesso e omitir a senha na resposta")
	void deveAtualizarCliente() throws Exception {
		ClienteDTO requisicao = ClienteDtoMockFactory.novoClienteMrDevops();
		requisicao.setSenha("SenhaForte123!");
		Cliente atualizado = ClienteMockFactory.clienteCadastradoMrDevopsId10();
		atualizado.setSenha("hash");

		BDDMockito.given(service.update(Mockito.eq(10L), Mockito.any(Cliente.class))).willReturn(atualizado);

		mvc.perform(MockMvcRequestBuilders.put(CLIENTE_API + "/10")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(requisicao)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("id").value(10))
			.andExpect(jsonPath("PrimeiroNome").value("Mr"))
			.andExpect(jsonPath("Senha").doesNotExist());
	}

	@Test
	@DisplayName("Deve retornar 404 ao atualizar cliente inexistente")
	void deveRetornar404AoAtualizarClienteInexistente() throws Exception {
		ClienteDTO requisicao = ClienteDtoMockFactory.novoClienteMrDevops();
		requisicao.setSenha("SenhaForte123!");

		BDDMockito.given(service.update(Mockito.eq(99L), Mockito.any(Cliente.class)))
				.willThrow(new NotFoundException("Cliente não encontrado!"));

		mvc.perform(MockMvcRequestBuilders.put(CLIENTE_API + "/99")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(requisicao)))
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("errors[0]").value("Cliente não encontrado!"));
	}

	@Test
	@DisplayName("Deve retornar 400 ao atualizar cliente com dados inválidos")
	void deveRetornar400AoAtualizarComDadosInvalidos() throws Exception {
		mvc.perform(MockMvcRequestBuilders.put(CLIENTE_API + "/10")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{}"))
			.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("Deve atualizar parcialmente um cliente")
	void deveAtualizarParcialmenteCliente() throws Exception {
		Cliente atualizado = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
		atualizado.setCidade("Campinas");
		atualizado.setSenha("hash");

		BDDMockito.given(service.partialUpdate(Mockito.eq(9L), Mockito.any(Cliente.class))).willReturn(atualizado);

		mvc.perform(MockMvcRequestBuilders.patch(CLIENTE_API + "/9")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"Cidade\":\"Campinas\"}"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("Cidade").value("Campinas"))
			.andExpect(jsonPath("Senha").doesNotExist());
	}

	@Test
	@DisplayName("Deve retornar 404 na atualização parcial de cliente inexistente")
	void deveRetornar404NaAtualizacaoParcialDeClienteInexistente() throws Exception {
		BDDMockito.given(service.partialUpdate(Mockito.eq(99L), Mockito.any(Cliente.class)))
				.willThrow(new NotFoundException("Cliente não encontrado!"));

		mvc.perform(MockMvcRequestBuilders.patch(CLIENTE_API + "/99")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"Cidade\":\"Campinas\"}"))
			.andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Deve excluir um cliente retornando 204")
	void deveExcluirCliente() throws Exception {
		mvc.perform(MockMvcRequestBuilders.delete(CLIENTE_API + "/9"))
			.andExpect(status().isNoContent());

		Mockito.verify(service, Mockito.times(1)).delete(9L);
	}

	@Test
	@DisplayName("Deve retornar 404 ao excluir cliente inexistente")
	void deveRetornar404AoExcluirClienteInexistente() throws Exception {
		BDDMockito.willThrow(new NotFoundException("Cliente não encontrado!")).given(service).delete(99L);

		mvc.perform(MockMvcRequestBuilders.delete(CLIENTE_API + "/99"))
			.andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Deve retornar uma lista simples quando nenhum parâmetro for informado")
	void deveListarTodosClientesSemParametros() throws Exception {
		BDDMockito.given(service.getList())
				.willReturn(Arrays.asList(ClienteMockFactory.clienteCadastradoPauloJorgeId9(),
						ClienteMockFactory.clienteCadastradoMrDevopsId10()));

		mvc.perform(MockMvcRequestBuilders.get(CLIENTE_API))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(2)))
			.andExpect(jsonPath("$[0].id").value(9));
	}

	@Test
	@DisplayName("Deve retornar página de clientes quando parâmetros de paginação forem informados")
	void deveListarClientesPaginados() throws Exception {
		Pageable pageable = PageRequest.of(0, 1, Sort.by("primeiroNome").ascending());
		Page<Cliente> pagina = new PageImpl<>(List.of(ClienteMockFactory.clienteCadastradoMrDevopsId10()), pageable, 2);

		BDDMockito.given(service.getList(Mockito.any(Pageable.class), Mockito.isNull(), Mockito.isNull()))
				.willReturn(pagina);

		mvc.perform(MockMvcRequestBuilders.get(CLIENTE_API + "?page=0&size=1&sort=primeiroNome,asc"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("content", org.hamcrest.Matchers.hasSize(1)))
			.andExpect(jsonPath("content[0].PrimeiroNome").value("Mr"))
			.andExpect(jsonPath("content[0].Senha").doesNotExist())
			.andExpect(jsonPath("totalElements").value(2))
			.andExpect(jsonPath("size").value(1));
	}

	@Test
	@DisplayName("Deve repassar os filtros de cidade e estado para o service")
	void deveFiltrarClientesPorCidadeEEstado() throws Exception {
		Pageable pageable = PageRequest.of(0, 20);
		Page<Cliente> pagina = new PageImpl<>(List.of(ClienteMockFactory.clienteCadastradoMrDevopsId10()), pageable, 1);

		BDDMockito.given(service.getList(Mockito.any(Pageable.class), Mockito.eq("Rio"), Mockito.eq("RJ")))
				.willReturn(pagina);

		mvc.perform(MockMvcRequestBuilders.get(CLIENTE_API + "?cidade=Rio&estado=RJ"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("content", org.hamcrest.Matchers.hasSize(1)))
			.andExpect(jsonPath("content[0].Cidade").value("Rio de Janeiro"));
	}
}
