package com.example.aluguelcarros.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.aluguelcarros.model.Cliente;
import com.example.aluguelcarros.repository.ClienteRepository;
import com.example.aluguelcarros.repository.PedidoRepository;
import com.example.aluguelcarros.repository.UsuarioRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final PedidoRepository pedidoRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteController(ClienteRepository repository, UsuarioRepository usuarioRepository,
            PedidoRepository pedidoRepository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.pedidoRepository = pedidoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public Cliente criar(@Valid @RequestBody Cliente cliente) {
        // O login não pode repetir entre nenhum usuário
        if (usuarioRepository.findByLogin(cliente.getLogin()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
        return repository.save(cliente);
    }

    @GetMapping
    public List<Cliente> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Cliente buscar(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public Cliente atualizar(@PathVariable Long id, @Valid @RequestBody Cliente dados, Authentication auth) {
        Cliente cliente = buscarDoUsuarioLogado(id, auth);
        cliente.setNome(dados.getNome());
        cliente.setRg(dados.getRg());
        cliente.setCpf(dados.getCpf());
        cliente.setEndereco(dados.getEndereco());
        cliente.setProfissao(dados.getProfissao());
        cliente.setRendimentos(dados.getRendimentos());
        return repository.save(cliente);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id, Authentication auth) {
        Cliente cliente = buscarDoUsuarioLogado(id, auth);
        // Quem tem pedidos não pode ser excluído (o histórico de pedidos se perderia)
        if (pedidoRepository.existsByClienteId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
        repository.delete(cliente);
    }

    // O cliente só pode alterar ou excluir o próprio cadastro
    private Cliente buscarDoUsuarioLogado(Long id, Authentication auth) {
        Cliente cliente = buscar(id);
        if (!cliente.getLogin().equals(auth.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return cliente;
    }
}