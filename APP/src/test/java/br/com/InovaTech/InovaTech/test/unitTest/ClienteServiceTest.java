package br.com.InovaTech.InovaTech.test.unitTest;

import com.fasterxml.jackson.core.JsonProcessingException;

import br.com.InovaTech.InovaTech.model.entity.Cliente;
import br.com.InovaTech.InovaTech.repository.MailingRepository;
import br.com.InovaTech.InovaTech.repository.ClienteRepository;
import br.com.InovaTech.InovaTech.service.impl.ClienteServiceImpl;
import br.com.InovaTech.InovaTech.exceptions.BusinessException;
import br.com.InovaTech.InovaTech.exceptions.InternalErrorException;
import br.com.InovaTech.InovaTech.test.helpers.ClienteMockFactory;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.doThrow;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    ClienteServiceImpl service;

    @Mock
    ClienteRepository repository;

    @Mock
    MailingRepository mailingRepository;

    @BeforeEach
    public void setUp() {
        this.service = new ClienteServiceImpl(repository, mailingRepository);
    }

	@Test
    @DisplayName("Ao salvar um novo cliente o método deve retornar um cliente salvo com Id")
    void save_NewCliente_ReturnsRegistredClienteWithWithId() {

        // PREPARACAO
        Cliente cliente = ClienteMockFactory.novoClientePauloJorge();
        String usuario = cliente.getUsuario();

        BDDMockito.when(repository.existsByUsuario(usuario)).thenReturn(false);

        Cliente clienteCadastrado = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
        BDDMockito.when(repository.save(cliente)).thenReturn(clienteCadastrado);

        // EXECUCAO
        Cliente clienteResponse = service.save(cliente);

        // VALIDACAO
        assertEquals(clienteCadastrado, clienteResponse); // podemos comparar pois estamos usando @Data na classe Cliente

        Mockito.verify(repository, Mockito.times(1)).existsByUsuario(usuario);
        Mockito.verify(repository, Mockito.times(1)).save(cliente);
    }

    @Test
    @DisplayName("O metodo save deve lancar excecao ao tentar salvar um cliente ja cadastrado")
    void save_DuplicateCliente_ReturnsBusinessExceptionWithMessageClienteJaCadastrado() {

        // PREPARACAO
        Cliente cliente = ClienteMockFactory.novoClientePauloJorge();
        String usuario = cliente.getUsuario();

        BDDMockito.when(repository.existsByUsuario(usuario)).thenReturn(true);

        // EXECUCAO
        Throwable exception = catchThrowable(() -> service.save(cliente));

        // VALIDACAO
        assertThat(exception).isInstanceOf(BusinessException.class);
        assertThat(exception).hasMessage("Cliente já cadastrado!");
        Mockito.verify(repository, Mockito.times(1)).existsByUsuario(usuario);
        Mockito.verify(repository, Mockito.never()).save(cliente);
    }

    @Test
    @DisplayName("O metodo save deve lancar excecao ao tentar salvar um cliente ja cadastrado")
    void save_DuplicateCliente_VerifyDoNotExecuteClienteSave() {

        // PREPARACAO
        Cliente cliente = ClienteMockFactory.novoClientePauloJorge();
        String usuario = cliente.getUsuario();

        BDDMockito.when(repository.existsByUsuario(usuario)).thenReturn(true);

        // EXECUCAO
        Throwable exception = catchThrowable(() -> service.save(cliente));

        // VALIDACAO
        assertThat(exception).isInstanceOf(BusinessException.class);
        Mockito.verify(repository, Mockito.times(1)).existsByUsuario(usuario);
        Mockito.verify(repository, Mockito.never()).save(cliente);
    }

    @Test
    @DisplayName("O metodo save deve lancar excecao ao tentar salvar um cliente com campos obrigatorios nao preenchidos")
    void save_NewClienteFieldsError_ReturnsInternalErrorExceptionWithMessageClientePossuiCamposInvalidos() {

        // PREPARACAO
        Cliente cliente = new Cliente();

        // EXECUCAO
        Throwable exception = catchThrowable(() -> service.save(cliente));

        // VALIDACAO
        assertThat(exception).isInstanceOf(InternalErrorException.class).hasMessage("Cliente possui campos obrigatórios não preenchidos");

        Mockito.verify(repository, Mockito.never()).existsByUsuario(cliente.getUsuario());
        Mockito.verify(repository, Mockito.never()).save(cliente);
    }

    @Test
    @DisplayName("O metodo save nao deve tratar excecao de sql lancada pelo repository ao tentar salvar o cliente")
    void save_existsByUsuarioError_ReturnsInternalErrorExceptionWithMessageErroAoConsultarBancoDeDados() {

        // PREPARACAO
        Cliente cliente = ClienteMockFactory.novoClientePauloJorge();
        String usuario = cliente.getUsuario();

        BDDMockito.when(repository.existsByUsuario(usuario)).thenThrow(new DataAccessException("Database error") {});

        // EXECUCAO
        Throwable exception = catchThrowable(() -> service.save(cliente));

        // VALIDACAO
        assertTrue(exception instanceof InternalErrorException);
        assertEquals(exception.getMessage(), "Erro ao acessar o banco de dados");
        Mockito.verify(repository, Mockito.times(1)).existsByUsuario(usuario);
        Mockito.verify(repository, Mockito.never()).save(cliente);
    }

    @Test
    @DisplayName("O metodo save nao deve tratar excecao de sql lancada pelo repository ao verificar se o usuario ja existe")
    void save_newClienteError_ReturnsInternalErrorExceptionWithMessageErroAoConsultarBancoDeDados() {

        // PREPARACAO
        Cliente cliente = ClienteMockFactory.novoClientePauloJorge();
        String usuario = cliente.getUsuario();

        BDDMockito.when(repository.save(cliente)).thenThrow(new DataAccessException("Database is offline") {});

        // EXECUCAO
        Throwable exception = catchThrowable(() -> service.save(cliente));

        // VALIDACAO
        assertTrue(exception instanceof InternalErrorException);
        assertEquals(exception.getMessage(), "Erro ao acessar o banco de dados");
        Mockito.verify(repository, Mockito.times(1)).existsByUsuario(usuario);
        Mockito.verify(repository, Mockito.times(1)).save(cliente);
    }

    @Test
    @DisplayName("O metodo findById deve retornar o cliente obtido pelo repository")
    void getById_FoundClienteByID_ReturnsClienteRegistred() {

        // PREPARACAO
        Cliente cliente = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
        long id = cliente.getId();

        BDDMockito.when(repository.findById(id)).thenReturn(Optional.of(cliente));

        // EXECUCAO
        Optional<Cliente> foundCliente = service.getById(id);

        // VALIDACAO
        assertTrue(foundCliente.isPresent());
        assertEquals(cliente, foundCliente.get());

        Mockito.verify(repository, Mockito.times(1)).findById(id);
    }

    @Test
    @DisplayName("O metodo getList deve retornar a lista de clientes obtidas a partir do repository")
    void getAll_FoundAllClientes_ReturnsAllClientesRegistred() {

        // PREPARACAO
        Cliente[] clienteList = {ClienteMockFactory.clienteCadastradoPauloJorgeId9(), ClienteMockFactory.clienteCadastradoMrDevopsId10()};

        BDDMockito.when(repository.findAll()).thenReturn(Arrays.asList(clienteList));

        // EXECUCAO
        Cliente[] result = service.getList().toArray(Cliente[]::new);

        // VALIDACAO
        assertTrue(Arrays.equals(clienteList, result));

        Mockito.verify(repository, Mockito.times(1)).findAll();
    }

    @Test
    @DisplayName("O metodo getById nao deve tratar excecao de sql lancada pelo repository ao se obter o cliente a partir do id")
    void getById_GetClienteByIdError_ReturnsInternalErrorExceptionWithMessageErroAoConsultarBancoDeDados() {

        // PREPARACAO
        long id = 1;
        BDDMockito.when(repository.findById(id)).thenThrow(new DataAccessException("Database error") {});

        // EXECUCAO
        Throwable exception = catchThrowable(() -> service.getById(id));

        // VALIDACAO
        assertTrue(exception instanceof InternalErrorException);
        assertEquals(exception.getMessage(), "Erro ao acessar o banco de dados");
        Mockito.verify(repository, Mockito.times(1)).findById(id);
    }


     @Test
    @DisplayName("O metodo getList nao deve tratar excecao de sql lancada pelo repository ao se obter a lista de clientes do banco")
    void getAll_GetAllClienteError_ReturnsInternalErrorExceptionWithMessageErroAoConsultarBancoDeDados() {

        // PREPARACAO
        BDDMockito.when(repository.findAll()).thenThrow(new DataAccessException("Database error") {});

        // EXECUCAO
        Throwable exception = catchThrowable(() -> service.getList());

        // VALIDACAO
        assertTrue(exception instanceof InternalErrorException);
        assertEquals(exception.getMessage(), "Erro ao acessar o banco de dados");
        Mockito.verify(repository, Mockito.times(1)).findAll();
    }

    @Test
    //Validar esse com o Vini
    @DisplayName("O metodo findById deve retornar empty caso o repository nao encontre o cliente pelo id")
    void getById_NonExistentCliente_ReturnsEmptyCliente() {

        // PREPARACAO
        long id = 99;
        BDDMockito.when(repository.findById(id)).thenReturn(Optional.empty());

        // EXECUCAO
        Optional<Cliente> notFoundCliente = service.getById(id);

        // VALIDACAO
        assertTrue(notFoundCliente.isEmpty());
        Mockito.verify(repository, Mockito.times(1)).findById(id);
    }


    @Test
    @DisplayName("O metodo save deve retornar exceção ao tentar enviar o email de boas vindas ao salvar um cliente com sucesso")
    void exceptionOnsendEmailonSaveNewClienteTest() throws JsonProcessingException {

        // PREPARACAO
        Cliente cliente = ClienteMockFactory.novoClientePauloJorge();
        String usuario = cliente.getUsuario();

        BDDMockito.when(repository.existsByUsuario(usuario)).thenReturn(false);
        Cliente clienteCadastrado = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
        BDDMockito.when(repository.save(cliente)).thenReturn(clienteCadastrado);
        BDDMockito.when(mailingRepository.sendEmail(usuario)).thenThrow(new InternalErrorException("Erro enviar email de boas vindas"));

        // EXECUCAO
        Throwable exception = catchThrowable(() -> service.save(cliente));

        // VALIDACAO
        assertThat(exception).isInstanceOf(InternalErrorException.class);
        assertThat(exception).hasMessage("Erro enviar email de boas vindas");
        assertTrue(exception instanceof InternalErrorException);
        Mockito.verify(mailingRepository, Mockito.times(1)).sendEmail(usuario);
    }
}
