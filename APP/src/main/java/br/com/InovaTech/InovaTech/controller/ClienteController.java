package br.com.InovaTech.InovaTech.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import br.com.InovaTech.InovaTech.model.dto.ClienteDTO;
import br.com.InovaTech.InovaTech.model.dto.LoginRequestDTO;
import br.com.InovaTech.InovaTech.model.dto.LoginResponseDTO;
import br.com.InovaTech.InovaTech.model.entity.Cliente;
import br.com.InovaTech.InovaTech.service.ClienteService;

import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@Tag(name = "Clientes", description = "API para gerenciamento de clientes")
public class ClienteController {

	private ClienteService service;
	private ModelMapper modelMapper;

	@InitBinder("cliente")
	protected void initClienteBinder(WebDataBinder binder) {
		binder.setDisallowedFields("Id");
	}

	public ClienteController(ClienteService service, ModelMapper modelMapper) {
		this.service = service;
		this.modelMapper = modelMapper;
	}

	@PostMapping("/clientes")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Criar novo cliente", 
			   description = "Cria um novo cliente no sistema com validações de dados")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "201", description = "Cliente criado com sucesso",
				content = @Content(schema = @Schema(implementation = ClienteDTO.class))),
		@ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
		@ApiResponse(responseCode = "500", description = "Erro interno do servidor")
	})
	public ClienteDTO createCliente(@RequestBody @Valid ClienteDTO cliente) {
		Cliente entity = modelMapper.map(cliente, Cliente.class);
		entity = service.save(entity);
		return modelMapper.map(entity, ClienteDTO.class);
	}

	@GetMapping("/clientes")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Listar clientes", 
			   description = "Retorna todos os clientes cadastrados. Quando informados os parâmetros de "
					   + "paginação (page, size, sort) ou de filtro (cidade, estado), retorna uma página de clientes")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Lista de clientes retornada com sucesso",
				content = @Content(schema = @Schema(implementation = ClienteDTO.class))),
		@ApiResponse(responseCode = "500", description = "Erro interno do servidor")
	})
	public Object getCliente (
			@Parameter(description = "Número da página (base 0)", example = "0")
			@RequestParam(value = "page", required = false) Integer page,
			@Parameter(description = "Quantidade de itens por página", example = "10")
			@RequestParam(value = "size", required = false) Integer size,
			@Parameter(description = "Ordenação no formato campo,(asc|desc)", example = "primeiroNome,asc")
			@RequestParam(value = "sort", required = false) String sort,
			@Parameter(description = "Filtro parcial por cidade", example = "São Paulo")
			@RequestParam(value = "cidade", required = false) String cidade,
			@Parameter(description = "Filtro parcial por estado", example = "SP")
			@RequestParam(value = "estado", required = false) String estado,
			@PageableDefault(size = 20) Pageable pageable) {

		boolean paginado = page != null || size != null || sort != null || cidade != null || estado != null;

		if (paginado) {
			Page<Cliente> pagina = this.service.getList(pageable, cidade, estado);
			return pagina.map(this::toDtoSemSenha);
		}

		List<Cliente> clienteList = this.service.getList();
		return clienteList.stream().map(this::toDtoSemSenha).collect(Collectors.toList());
	}

	@PutMapping("/clientes/{id}")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Atualizar cliente", 
			   description = "Atualiza todos os dados de um cliente existente")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Cliente atualizado com sucesso",
				content = @Content(schema = @Schema(implementation = ClienteDTO.class))),
		@ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
		@ApiResponse(responseCode = "404", description = "Cliente não encontrado"),
		@ApiResponse(responseCode = "500", description = "Erro interno do servidor")
	})
	public ClienteDTO updateCliente(
			@Parameter(description = "ID do cliente a ser atualizado", required = true)
			@PathVariable long id,
			@RequestBody @Valid ClienteDTO cliente) {
		Cliente entity = modelMapper.map(cliente, Cliente.class);
		return toDtoSemSenha(service.update(id, entity));
	}

	@PatchMapping("/clientes/{id}")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Atualizar cliente parcialmente", 
			   description = "Atualiza apenas os campos informados de um cliente existente")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Cliente atualizado com sucesso",
				content = @Content(schema = @Schema(implementation = ClienteDTO.class))),
		@ApiResponse(responseCode = "404", description = "Cliente não encontrado"),
		@ApiResponse(responseCode = "500", description = "Erro interno do servidor")
	})
	public ClienteDTO partialUpdateCliente(
			@Parameter(description = "ID do cliente a ser atualizado", required = true)
			@PathVariable long id,
			@RequestBody ClienteDTO cliente) {
		Cliente entity = modelMapper.map(cliente, Cliente.class);
		return toDtoSemSenha(service.partialUpdate(id, entity));
	}

	@DeleteMapping("/clientes/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Excluir cliente", 
			   description = "Remove um cliente existente do sistema")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "204", description = "Cliente excluído com sucesso"),
		@ApiResponse(responseCode = "404", description = "Cliente não encontrado"),
		@ApiResponse(responseCode = "500", description = "Erro interno do servidor")
	})
	public void deleteCliente(
			@Parameter(description = "ID do cliente a ser excluído", required = true)
			@PathVariable long id) {
		service.delete(id);
	}

	private ClienteDTO toDtoSemSenha(Cliente cliente) {
		ClienteDTO dto = modelMapper.map(cliente, ClienteDTO.class);
		dto.setSenha(null); // Remove a senha da resposta por segurança
		return dto;
	}


	@GetMapping("/clientes/{id}")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Buscar cliente por ID", 
			   description = "Retorna os dados de um cliente específico pelo seu ID")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Cliente encontrado com sucesso",
				content = @Content(schema = @Schema(implementation = ClienteDTO.class))),
		@ApiResponse(responseCode = "404", description = "Cliente não encontrado"),
		@ApiResponse(responseCode = "500", description = "Erro interno do servidor")
	})
	public ClienteDTO getCliente(
			@Parameter(description = "ID do cliente a ser buscado", required = true)
			@PathVariable long id) {
		return service
			.getById(id)
			.map(cliente -> {
				ClienteDTO dto = modelMapper.map(cliente, ClienteDTO.class);
				dto.setSenha(null); // Remove a senha da resposta por segurança
				return dto;
			})
			.orElseThrow( () -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}

	@PostMapping("/login")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Realizar login", 
			   description = "Autentica um cliente usando email e senha e cria uma sessão")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Resposta do login processada",
				content = @Content(schema = @Schema(implementation = LoginResponseDTO.class))),
		@ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos"),
		@ApiResponse(responseCode = "500", description = "Erro interno do servidor")
	})
	public LoginResponseDTO login(@RequestBody @Valid LoginRequestDTO loginRequest, HttpSession session) {
		LoginResponseDTO response = service.login(loginRequest);
		
		// Se o login foi bem-sucedido, cria sessão
		if (response.isSucesso()) {
			session.setAttribute("usuarioLogado", response.getCliente());
			response.setSessionId(session.getId());
		}
		
		return response;
	}

	@GetMapping("/session")
	@Operation(summary = "Verificar sessão", 
			   description = "Verifica se existe uma sessão ativa e retorna os dados do usuário")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Sessão verificada"),
		@ApiResponse(responseCode = "401", description = "Sessão inválida ou expirada")
	})
	public Map<String, Object> verificarSessao(HttpSession session) {
		ClienteDTO usuarioLogado = (ClienteDTO) session.getAttribute("usuarioLogado");
		
		if (usuarioLogado != null) {
			return Map.of(
				"sessaoAtiva", true,
				"usuario", usuarioLogado,
				"sessionId", session.getId()
			);
		}
		
		throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão inválida ou expirada");
	}

	@PostMapping("/logout")
	@Operation(summary = "Fazer logout", 
			   description = "Invalida a sessão atual do usuário")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Logout realizado com sucesso")
	})
	public Map<String, String> logout(HttpSession session) {
		session.invalidate();
		return Map.of("mensagem", "Logout realizado com sucesso");
	}
}
