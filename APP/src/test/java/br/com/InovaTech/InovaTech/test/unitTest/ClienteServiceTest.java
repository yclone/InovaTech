package br.com.InovaTech.InovaTech.test.unitTest;

import com.fasterxml.jackson.core.JsonProcessingException;

import br.com.InovaTech.InovaTech.model.dto.ClienteDTO;
import br.com.InovaTech.InovaTech.model.dto.LoginRequestDTO;
import br.com.InovaTech.InovaTech.model.dto.LoginResponseDTO;
import br.com.InovaTech.InovaTech.model.entity.Cliente;
import br.com.InovaTech.InovaTech.repository.MailingRepository;
import br.com.InovaTech.InovaTech.repository.ClienteRepository;
import br.com.InovaTech.InovaTech.service.impl.ClienteServiceImpl;
import br.com.InovaTech.InovaTech.exceptions.BusinessException;
import br.com.InovaTech.InovaTech.exceptions.InternalErrorException;
import br.com.InovaTech.InovaTech.test.helpers.ClienteMockFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.modelmapper.ModelMapper;

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

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    ModelMapper modelMapper;

    @BeforeEach
    public void setUp() {
        this.service = new ClienteServiceImpl(repository, mailingRepository, passwordEncoder, modelMapper);
    }

    private Cliente clienteValido() {
        Cliente cliente = ClienteMockFactory.novoClientePauloJorge();
        cliente.setSenha("senha123");
        return cliente;
    }

    @Test
    @DisplayName("Deve salvar cliente, criptografar a senha e enviar email de boas-vindas")
    void deveSalvarClienteComSucesso() throws JsonProcessingException {
        Cliente cliente = clienteValido();
        Cliente clienteSalvo = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
        clienteSalvo.setSenha("hash");

        when(repository.existsByUsuario(cliente.getUsuario())).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("hash");
        when(repository.save(cliente)).thenReturn(clienteSalvo);

        Cliente resultado = service.save(cliente);

        assertThat(resultado).isEqualTo(clienteSalvo);
        assertThat(cliente.getSenha()).isEqualTo("hash");
        verify(passwordEncoder, times(1)).encode("senha123");
        verify(mailingRepository, times(1)).sendEmail(clienteSalvo.getUsuario());
    }

    @Test
    @DisplayName("Não deve salvar cliente com campos obrigatórios inválidos")
    void naoDeveSalvarClienteInvalido() {
        Cliente cliente = ClienteMockFactory.novoClientePauloJorge();

        Throwable erro = catchThrowable(() -> service.save(cliente));

        assertThat(erro).isInstanceOf(InternalErrorException.class)
                .hasMessage("Cliente possui campos obrigatórios não preenchidos");
        verify(repository, never()).save(Mockito.any(Cliente.class));
    }

    @Test
    @DisplayName("Não deve salvar cliente com usuário já cadastrado")
    void naoDeveSalvarClienteDuplicado() {
        Cliente cliente = clienteValido();
        when(repository.existsByUsuario(cliente.getUsuario())).thenReturn(true);

        Throwable erro = catchThrowable(() -> service.save(cliente));

        assertThat(erro).isInstanceOf(BusinessException.class).hasMessage("Cliente já cadastrado!");
        verify(repository, never()).save(Mockito.any(Cliente.class));
    }

    @Test
    @DisplayName("Deve lançar BusinessException quando o envio de email falhar")
    void deveFalharQuandoEnvioDeEmailFalhar() throws JsonProcessingException {
        Cliente cliente = clienteValido();
        Cliente clienteSalvo = ClienteMockFactory.clienteCadastradoPauloJorgeId9();

        when(repository.existsByUsuario(cliente.getUsuario())).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("hash");
        when(repository.save(cliente)).thenReturn(clienteSalvo);
        doThrow(new JsonProcessingException("falha") {}).when(mailingRepository).sendEmail(clienteSalvo.getUsuario());

        Throwable erro = catchThrowable(() -> service.save(cliente));

        assertThat(erro).isInstanceOf(BusinessException.class).hasMessage("erro ao enviar email!");
    }

    @Test
    @DisplayName("Deve converter erro de banco em InternalErrorException ao salvar")
    void deveTratarErroDeBancoAoSalvar() {
        Cliente cliente = clienteValido();
        when(repository.existsByUsuario(cliente.getUsuario()))
                .thenThrow(new DataAccessException("indisponível") {});

        Throwable erro = catchThrowable(() -> service.save(cliente));

        assertThat(erro).isInstanceOf(InternalErrorException.class).hasMessage("Erro ao acessar o banco de dados");
    }

    @Test
    @DisplayName("Deve retornar a lista de clientes cadastrados")
    void deveListarClientes() {
        List<Cliente> clientes = Arrays.asList(
                ClienteMockFactory.clienteCadastradoPauloJorgeId9(),
                ClienteMockFactory.clienteCadastradoMrDevopsId10());
        when(repository.findAll()).thenReturn(clientes);

        assertThat(service.getList()).isEqualTo(clientes);
    }

    @Test
    @DisplayName("Deve converter erro de banco em InternalErrorException ao listar")
    void deveTratarErroDeBancoAoListar() {
        when(repository.findAll()).thenThrow(new DataAccessException("indisponível") {});

        Throwable erro = catchThrowable(() -> service.getList());

        assertThat(erro).isInstanceOf(InternalErrorException.class).hasMessage("Erro ao acessar o banco de dados");
    }

    @Test
    @DisplayName("Deve buscar cliente por id")
    void deveBuscarClientePorId() {
        Cliente cliente = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
        when(repository.findById(9L)).thenReturn(Optional.of(cliente));

        Optional<Cliente> encontrado = service.getById(9L);

        assertTrue(encontrado.isPresent());
        assertEquals(cliente, encontrado.get());
    }

    @Test
    @DisplayName("Deve retornar Optional vazio quando o cliente não existir")
    void deveRetornarVazioQuandoClienteNaoExistir() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertFalse(service.getById(99L).isPresent());
    }

    @Test
    @DisplayName("Deve converter erro de banco em InternalErrorException ao buscar por id")
    void deveTratarErroDeBancoAoBuscarPorId() {
        when(repository.findById(9L)).thenThrow(new DataAccessException("indisponível") {});

        Throwable erro = catchThrowable(() -> service.getById(9L));

        assertThat(erro).isInstanceOf(InternalErrorException.class).hasMessage("Erro ao acessar o banco de dados");
    }

    @Test
    @DisplayName("Deve autenticar cliente com credenciais válidas e omitir a senha na resposta")
    void deveAutenticarClienteComCredenciaisValidas() {
        Cliente cliente = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
        cliente.setSenha("hash");
        LoginRequestDTO request = LoginRequestDTO.builder()
                .usuario(cliente.getUsuario())
                .senha("senha123")
                .build();
        ClienteDTO clienteDTO = ClienteDTO.builder().usuario(cliente.getUsuario()).senha("hash").build();

        when(repository.findByUsuario(request.getUsuario())).thenReturn(Optional.of(cliente));
        when(passwordEncoder.matches("senha123", "hash")).thenReturn(true);
        when(modelMapper.map(cliente, ClienteDTO.class)).thenReturn(clienteDTO);

        LoginResponseDTO response = service.login(request);

        assertTrue(response.isSucesso());
        assertEquals("Login realizado com sucesso", response.getMensagem());
        assertThat(response.getCliente()).isEqualTo(clienteDTO);
        assertThat(response.getCliente().getSenha()).isNull();
    }

    @Test
    @DisplayName("Deve negar login quando a senha estiver incorreta")
    void deveNegarLoginComSenhaIncorreta() {
        Cliente cliente = ClienteMockFactory.clienteCadastradoPauloJorgeId9();
        cliente.setSenha("hash");
        LoginRequestDTO request = LoginRequestDTO.builder()
                .usuario(cliente.getUsuario())
                .senha("errada")
                .build();

        when(repository.findByUsuario(request.getUsuario())).thenReturn(Optional.of(cliente));
        when(passwordEncoder.matches("errada", "hash")).thenReturn(false);

        LoginResponseDTO response = service.login(request);

        assertFalse(response.isSucesso());
        assertEquals("Usuário ou senha incorretos", response.getMensagem());
        assertThat(response.getCliente()).isNull();
        verify(modelMapper, never()).map(Mockito.any(), Mockito.eq(ClienteDTO.class));
    }

    @Test
    @DisplayName("Deve negar login quando o usuário não existir")
    void deveNegarLoginComUsuarioInexistente() {
        LoginRequestDTO request = LoginRequestDTO.builder()
                .usuario("nao.existe@email.com.br")
                .senha("senha123")
                .build();
        when(repository.findByUsuario(request.getUsuario())).thenReturn(Optional.empty());

        LoginResponseDTO response = service.login(request);

        assertFalse(response.isSucesso());
        assertEquals("Usuário ou senha incorretos", response.getMensagem());
        verify(passwordEncoder, never()).matches(Mockito.anyString(), Mockito.anyString());
    }

    @Test
    @DisplayName("Deve converter erro de banco em InternalErrorException no login")
    void deveTratarErroDeBancoNoLogin() {
        LoginRequestDTO request = LoginRequestDTO.builder()
                .usuario("paulo.jorge@email.com.br")
                .senha("senha123")
                .build();
        when(repository.findByUsuario(request.getUsuario()))
                .thenThrow(new DataAccessException("indisponível") {});

        Throwable erro = catchThrowable(() -> service.login(request));

        assertThat(erro).isInstanceOf(InternalErrorException.class).hasMessage("Erro ao acessar o banco de dados");
    }
}
