package com.example.aluguelcarros.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.aluguelcarros.model.Usuario;
import com.example.aluguelcarros.repository.UsuarioRepository;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    // Devolve quem está logado 
    @GetMapping("/me")
    public Usuario me(Authentication auth) {
        return repository.findByLogin(auth.getName()).orElseThrow();
    }
}