import { useEffect, useState } from 'react'
import { api } from '../api'
import ResumoContrato from '../components/ResumoContrato'
import { STATUS, descricaoAutomovel, moeda, rendaTotal } from '../formato'

function mensagemErro(e) {
  if (e.status === 409) return 'O status deste pedido não permite essa ação.'
  if (e.status === 400) return 'Confira o valor informado.'
  return e.message
}

// Tela do agente (empresa ou banco): avaliar, modificar e contratar pedidos
export default function PedidosAgente({ usuario }) {
  const ehBanco = usuario.papeis?.includes('BANCO')
  const [pedidos, setPedidos] = useState([])
  const [automoveis, setAutomoveis] = useState([])
  const [filtro, setFiltro] = useState('TODOS')
  const [acao, setAcao] = useState(null) 
  const [carregando, setCarregando] = useState(true)
  const [ocupado, setOcupado] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    Promise.all([api.listarPedidos(), api.listarAutomoveis()])
      .then(([listaPedidos, listaAutomoveis]) => {
        setPedidos(listaPedidos)
        setAutomoveis(listaAutomoveis)
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  async function executar(chamada) {
    setErro('')
    setOcupado(true)
    try {
      await chamada()
    } catch (e) {
      setErro(mensagemErro(e))
    } finally {
      setOcupado(false)
    }
  }

  function trocarNaLista(pedido) {
    setPedidos((lista) => lista.map((p) => (p.id === pedido.id ? pedido : p)))
  }

  function avaliar(pedido, aprovado) {
    if (!aprovado && !window.confirm(`Reprovar o pedido nº ${pedido.id}?`)) return
    executar(async () => trocarNaLista(await api.avaliarPedido(pedido.id, aprovado)))
  }

  // Abre o formulário da ação na linha do pedido
  function abrir(pedido, tipo) {
    const valorInicial = { modificar: pedido.automovel.id, contrato: 'CLIENTE', credito: '' }[tipo]
    setAcao({ id: pedido.id, tipo, valor: valorInicial })
  }

  function confirmar(evento) {
    evento.preventDefault()
    const chamadas = {
      modificar: () => api.modificarPedido(acao.id, Number(acao.valor)),
      contrato: () => api.executarContrato(acao.id, acao.valor),
      credito: () => api.concederCredito(acao.id, Number(acao.valor)),
    }
    executar(async () => {
      trocarNaLista(await chamadas[acao.tipo]())
      setAcao(null)
    })
  }

  function campoDaAcao(pedido) {
    const alterar = (e) => setAcao({ ...acao, valor: e.target.value })
    if (acao.tipo === 'modificar') {
      return (
        <select aria-label="Novo automóvel" value={acao.valor} onChange={alterar}>
          {automoveis.map((a) => <option key={a.id} value={a.id}>{descricaoAutomovel(a)}</option>)}
        </select>
      )
    }
    if (acao.tipo === 'contrato') {
      return (
        <select aria-label="Registrar o carro em nome de" value={acao.valor} onChange={alterar}>
          <option value="CLIENTE">Carro em nome do cliente ({pedido.cliente.nome})</option>
          <option value="AGENTE">Carro em nome de {usuario.nome}</option>
        </select>
      )
    }
    return (
      <input
        type="number" min="0.01" step="0.01" placeholder="Valor do crédito (R$)"
        aria-label="Valor do crédito" value={acao.valor} onChange={alterar} required autoFocus
      />
    )
  }

  function botoes(pedido) {
    if (pedido.status === 'EM_ANALISE') {
      return (
        <>
          <button onClick={() => avaliar(pedido, true)} disabled={ocupado}>Aprovar</button>
          <button className="perigo" onClick={() => avaliar(pedido, false)} disabled={ocupado}>Reprovar</button>
          <button className="secundario" onClick={() => abrir(pedido, 'modificar')} disabled={ocupado}>Modificar</button>
        </>
      )
    }
    if (pedido.status === 'APROVADO') {
      return <button onClick={() => abrir(pedido, 'contrato')} disabled={ocupado}>Executar contrato</button>
    }
    if (pedido.status === 'CONTRATADO' && ehBanco && !pedido.contrato.contratoCredito) {
      return <button onClick={() => abrir(pedido, 'credito')} disabled={ocupado}>Conceder crédito</button>
    }
    return <span className="vazio">—</span>
  }

  if (carregando) return <p className="centro">Carregando pedidos…</p>

  // Mais recentes primeiro
  const visiveis = pedidos
    .filter((p) => filtro === 'TODOS' || p.status === filtro)
    .sort((a, b) => b.id - a.id)

  return (
    <main className="cartao largo">
      <h1>Pedidos de aluguel</h1>
      <p className="vazio">
        Avalie os pedidos em análise e execute o contrato dos aprovados.
        {ehBanco && ' Como banco, você também pode conceder crédito aos contratos.'}
      </p>

      <div className="linha">
        <label className="filtro">
          Mostrar
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="TODOS">Todos os pedidos</option>
            {Object.entries(STATUS).map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}
          </select>
        </label>
      </div>

      {erro && <p className="erro" role="alert">{erro}</p>}

      {visiveis.length === 0 ? (
        <p className="vazio">Nenhum pedido encontrado.</p>
      ) : (
        <div className="tabela">
          <table>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Cliente</th>
                <th>Automóvel</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.cliente.nome}
                    <span className="detalhe">
                      CPF {p.cliente.cpf} · {p.cliente.profissao} · renda {moeda(rendaTotal(p.cliente))}
                    </span>
                  </td>
                  <td>{descricaoAutomovel(p.automovel)}</td>
                  <td>
                    <span className={`status ${p.status}`}>{STATUS[p.status] ?? p.status}</span>
                    {p.contrato && <ResumoContrato contrato={p.contrato} />}
                  </td>
                  <td>
                    {acao?.id === p.id ? (
                      <form className="acoes" onSubmit={confirmar}>
                        {campoDaAcao(p)}
                        <button disabled={ocupado}>Confirmar</button>
                        <button type="button" className="secundario" onClick={() => setAcao(null)} disabled={ocupado}>
                          Voltar
                        </button>
                      </form>
                    ) : (
                      <div className="acoes">{botoes(p)}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}