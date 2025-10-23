package br.com.InovaTech.InovaTech.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.InovaTech.InovaTech.model.entity.Cliente;



public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    boolean existsByUsuario(String usuario);
}
