package com.example.aluguelcarros.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.aluguelcarros.model.Automovel;
import com.example.aluguelcarros.model.Pedido;
import com.example.aluguelcarros.model.StatusPedido;
import com.example.aluguelcarros.repository.AutomovelRepository;
import com.example.aluguelcarros.repository.ClienteRepository;
import com.example.aluguelcarros.repository.PedidoRepository;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoRepository repository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;

    public PedidoController(PedidoRepository repository, ClienteRepository clienteRepository,
            AutomovelRepository automovelRepository) {
        this.repository = repository;
        this.clienteRepository = clienteRepository;
        this.automovelRepository = automovelRepository;
    }

    // Cliente cria um pedido comecando em análise
    @PostMapping
    public Pedido criar(@RequestBody Pedido dados, Authentication auth) {
        Pedido pedido = new Pedido();
        pedido.setCliente(clienteRepository.findByLogin(auth.getName()).orElseThrow());
        pedido.setAutomovel(buscarAutomovel(dados));
        pedido.setStatus(StatusPedido.EM_ANALISE);
        return repository.save(pedido);
    }

    // Cliente vê os próprios pedidos agente vê todos
    @GetMapping
    public List<Pedido> listar(Authentication auth) {
        if (ehAgente(auth)) {
            return repository.findAll();
        }
        return repository.findByClienteLogin(auth.getName());
    }

    @GetMapping("/{id}")
    public Pedido buscar(@PathVariable Long id, Authentication auth) {
        Pedido pedido = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!ehAgente(auth) && !pedido.getCliente().getLogin().equals(auth.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return pedido;
    }

    // Cliente (dono) ou agente troca o carro, enquanto o pedido está em análise
    @PutMapping("/{id}")
    public Pedido modificar(@PathVariable Long id, @RequestBody Pedido dados, Authentication auth) {
        Pedido pedido = buscar(id, auth);
        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
        pedido.setAutomovel(buscarAutomovel(dados));
        return repository.save(pedido);
    }

    @PostMapping("/{id}/cancelar")
    public Pedido cancelar(@PathVariable Long id, Authentication auth) {
        Pedido pedido = buscar(id, auth);
        if (pedido.getStatus() != StatusPedido.EM_ANALISE && pedido.getStatus() != StatusPedido.APROVADO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
        pedido.setStatus(StatusPedido.CANCELADO);
        return repository.save(pedido);
    }

    // Agente aprova ou reprova
    @PostMapping("/{id}/avaliar")
    public Pedido avaliar(@PathVariable Long id, @RequestParam boolean aprovado, Authentication auth) {
        Pedido pedido = buscar(id, auth);
        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
        pedido.setStatus(aprovado ? StatusPedido.APROVADO : StatusPedido.REPROVADO);
        return repository.save(pedido);
    }

    private Automovel buscarAutomovel(Pedido dados) {
        if (dados.getAutomovel() == null || dados.getAutomovel().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        return automovelRepository.findById(dados.getAutomovel().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST));
    }

    private boolean ehAgente(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(papel -> papel.getAuthority().equals("ROLE_AGENTE"));
    }
}