package com.example.aluguelcarros.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.aluguelcarros.model.Automovel;
import com.example.aluguelcarros.repository.AutomovelRepository;

@RestController
@RequestMapping("/automoveis")
public class AutomovelController {

    private final AutomovelRepository repository;

    public AutomovelController(AutomovelRepository repository) {
        this.repository = repository;
    }

    // Lista os carros para o cliente escolher no pedido
    @GetMapping
    public List<Automovel> listar() {
        return repository.findAll();
    }
}