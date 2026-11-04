package com.example.aluguelcarros.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.aluguelcarros.model.Agente;
import com.example.aluguelcarros.model.Automovel;
import com.example.aluguelcarros.model.Banco;
import com.example.aluguelcarros.model.Empresa;
import com.example.aluguelcarros.model.Usuario;
import com.example.aluguelcarros.repository.AutomovelRepository;
import com.example.aluguelcarros.repository.UsuarioRepository;

@Component
public class DadosIniciais implements CommandLineRunner {

    private final UsuarioRepository repository;
    private final AutomovelRepository automovelRepository;
    private final PasswordEncoder passwordEncoder;
    private final String senha;

    public DadosIniciais(UsuarioRepository repository, AutomovelRepository automovelRepository,
            PasswordEncoder passwordEncoder, @Value("${AGENTE_SENHA}") String senha) {
        this.repository = repository;
        this.automovelRepository = automovelRepository;
        this.passwordEncoder = passwordEncoder;
        this.senha = senha;
    }

    @Override
    public void run(String... args) {
        Usuario empresa = criarSeNaoExistir(new Empresa(), "Locadora Central", "empresa");
        criarSeNaoExistir(new Banco(), "Banco Central", "banco");

        if (automovelRepository.count() == 0) {
            criarAutomovel("12345678901", 2023, "Fiat", "Argo", "ABC1D23", empresa);
            criarAutomovel("12345678902", 2024, "Volkswagen", "Polo", "DEF4G56", empresa);
            criarAutomovel("12345678903", 2022, "Chevrolet", "Onix", "GHI7J89", empresa);
        }
    }

    private Usuario criarSeNaoExistir(Agente agente, String nome, String login) {
        return repository.findByLogin(login).orElseGet(() -> {
            agente.setNome(nome);
            agente.setLogin(login);
            agente.setSenha(passwordEncoder.encode(senha));
            return repository.save(agente);
        });
    }

    private void criarAutomovel(String matricula, int ano, String marca, String modelo, String placa,
            Usuario proprietario) {
        Automovel automovel = new Automovel();
        automovel.setMatricula(matricula);
        automovel.setAno(ano);
        automovel.setMarca(marca);
        automovel.setModelo(modelo);
        automovel.setPlaca(placa);
        automovel.setProprietario(proprietario);
        automovelRepository.save(automovel);
    }
}