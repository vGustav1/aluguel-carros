package com.example.aluguelcarros.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.aluguelcarros.model.Automovel;

public interface AutomovelRepository extends JpaRepository<Automovel, Long> {
}