package com.example.aluguelcarros.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.aluguelcarros.model.Agente;
import com.example.aluguelcarros.model.Banco;
import com.example.aluguelcarros.model.Empresa;
import com.example.aluguelcarros.repository.UsuarioRepository;

// Agentes não se cadastram pelo site: o sistema cria um de cada ao subir
@Component
public class DadosIniciais implements CommandLineRunner {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final String senha;

    public DadosIniciais(UsuarioRepository repository, PasswordEncoder passwordEncoder,
            @Value("${AGENTE_SENHA}") String senha) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.senha = senha;
    }

    @Override
    public void run(String... args) {
        criarSeNaoExistir(new Empresa(), "Locadora Central", "empresa");
        criarSeNaoExistir(new Banco(), "Banco Central", "banco");
    }

    private void criarSeNaoExistir(Agente agente, String nome, String login) {
        if (repository.findByLogin(login).isPresent()) {
            return;
        }
        agente.setNome(nome);
        agente.setLogin(login);
        agente.setSenha(passwordEncoder.encode(senha));
        repository.save(agente);
    }
}