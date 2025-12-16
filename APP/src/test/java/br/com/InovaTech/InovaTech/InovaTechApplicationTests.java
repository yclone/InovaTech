package br.com.InovaTech.InovaTech;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class InovaTechApplicationTests {

	@Test
	@DisplayName("O metodo createCliente deve funcionar conforme o esperado ao receber um cliente valido")
	void post_NewCliente_UsingRepositoryMock() throws Exception {

	    // PREPARACAO
		Cliente clienteToSave = ClienteMockFactory.novoClientePauloJorge();
		Cliente clienteAfterSave = ClienteMockFactory.clienteCadastradoPauloJorgeId9();

		BDDMockito.given(repository.existsByUsuario(Mockito.anyString())).willReturn(false);
	    BDDMockito.given(repository.save(Mockito.any(Cliente.class))).willReturn(clienteAfterSave);
	    BDDMockito.given(mailingRepository.sendEmail(Mockito.anyString())).willReturn(null);

		ClienteDTO clienteDtoToCreate = ClienteDtoMockFactory.novoClientePauloJorge();
		ClienteDTO expectedResult = ClienteDtoMockFactory.clienteCadastradoPauloJorgeId9();
		
		BDDMockito.given(modelMapper.map(Mockito.any(ClienteDTO.class), Mockito.eq(Cliente.class)))
		    .willReturn(clienteToSave);
		BDDMockito.given(modelMapper.map(Mockito.any(Cliente.class), Mockito.eq(ClienteDTO.class)))
		    .willReturn(expectedResult);

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
