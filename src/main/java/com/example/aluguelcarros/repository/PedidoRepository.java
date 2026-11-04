package com.example.aluguelcarros.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.aluguelcarros.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByClienteLogin(String login);

    boolean existsByClienteId(Long clienteId);
}