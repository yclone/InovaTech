package br.com.InovaTech.InovaTech.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.InovaTech.InovaTech.model.entity.Cliente;
import java.util.Optional;



public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    boolean existsByUsuario(String usuario);
    
    Optional<Cliente> findByUsuario(String usuario);

    Page<Cliente> findByCidadeContainingIgnoreCaseAndEstadoContainingIgnoreCase(String cidade, String estado,
            Pageable pageable);
}
