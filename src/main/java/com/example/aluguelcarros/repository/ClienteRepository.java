package com.example.aluguelcarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.aluguelcarros.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    
    

}