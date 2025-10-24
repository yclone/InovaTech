package br.com.InovaTech.InovaTech.controller;

import jakarta.validation.Valid;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import br.com.InovaTech.InovaTech.model.dto.ClienteDTO;
import br.com.InovaTech.InovaTech.model.entity.Cliente;
import br.com.InovaTech.InovaTech.service.impl.ClienteServiceImpl;
import br.com.InovaTech.InovaTech.repository.ClienteRepository;
import br.com.InovaTech.InovaTech.repository.MailingRepository;
import br.com.InovaTech.InovaTech.exceptions.BusinessException;

import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.core.JsonProcessingException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Tag(name = "Clientes", description = "API para gerenciamento de clientes")
public class ClienteController {

	private ClienteServiceImpl service;
	private ModelMapper modelMapper;
	private ClienteRepository repository;
	private MailingRepository mailingRepository;

	@InitBinder("cliente")
	protected void initClienteBinder(WebDataBinder binder) {
		binder.setDisallowedFields("Id");
	}

	public ClienteController(ModelMapper modelMapper, ClienteRepository repository, MailingRepository mailingRepository) {
		this.modelMapper = modelMapper;
		this.repository = repository;
		this.mailingRepository = mailingRepository;
	}
	
	// Setter para injeção opcional do service (usado apenas em alguns métodos)
	@Autowired(required = false)
	public void setService(ClienteServiceImpl service) {
		this.service = service;
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
		
		try {
			if (repository.existsByUsuario(entity.getUsuario())){
				throw new BusinessException("Cliente já cadastrado!");
			}
			Cliente clienteSalvo = repository.save(entity);
			try {
				mailingRepository.sendEmail(clienteSalvo.getUsuario());
			} catch (JsonProcessingException e) {
				throw new BusinessException("erro ao enviar email!");
			}
			return modelMapper.map(clienteSalvo, ClienteDTO.class);
		} catch (BusinessException e) {
			throw e;
		}
	}

	@GetMapping("/clientes")
	@ResponseStatus(HttpStatus.OK)
	@Operation(summary = "Listar todos os clientes", 
			   description = "Retorna uma lista com todos os clientes cadastrados no sistema")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "Lista de clientes retornada com sucesso",
				content = @Content(schema = @Schema(implementation = ClienteDTO.class))),
		@ApiResponse(responseCode = "500", description = "Erro interno do servidor")
	})
	public List<ClienteDTO> getCliente () {
		List<Cliente> clienteList = this.service.getList();
		return clienteList.stream().map(cliente -> modelMapper.map(cliente, ClienteDTO.class)).collect(Collectors.toList());
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
			.map(cliente -> modelMapper.map(cliente, ClienteDTO.class))
			.orElseThrow( () -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}
}
