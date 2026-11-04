import { useEffect, useState } from 'react'
import { api } from '../api'
import { STATUS, descricaoAutomovel, moeda, rendaTotal } from '../formato'

function mensagemErro(e) {
  return e.status === 409 ? 'O status deste pedido não permite essa ação.' : e.message
}

export default function PedidosAgente() {
  const [pedidos, setPedidos] = useState([])
  const [automoveis, setAutomoveis] = useState([])
  const [filtro, setFiltro] = useState('TODOS')
  const [editando, setEditando] = useState(null)
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

  async function executar(acao) {
    setErro('')
    setOcupado(true)
    try {
      await acao()
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

  function salvarModificacao(evento) {
    evento.preventDefault()
    executar(async () => {
      trocarNaLista(await api.modificarPedido(editando.id, Number(editando.automovelId)))
      setEditando(null)
    })
  }

  if (carregando) return <p className="centro">Carregando pedidos…</p>

  const visiveis = pedidos
    .filter((p) => filtro === 'TODOS' || p.status === filtro)
    .sort((a, b) => b.id - a.id)

  return (
    <main className="cartao largo">
      <h1>Pedidos de aluguel</h1>
      <p className="vazio">Analise a renda do cliente e aprove ou reprove os pedidos em análise.</p>

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
                  <td><span className={`status ${p.status}`}>{STATUS[p.status] ?? p.status}</span></td>
                  <td>
                    {editando?.id === p.id ? (
                      <form className="acoes" onSubmit={salvarModificacao}>
                        <select
                          aria-label="Novo automóvel"
                          value={editando.automovelId}
                          onChange={(e) => setEditando({ ...editando, automovelId: e.target.value })}
                        >
                          {automoveis.map((a) => <option key={a.id} value={a.id}>{descricaoAutomovel(a)}</option>)}
                        </select>
                        <button disabled={ocupado}>Salvar</button>
                        <button type="button" className="secundario" onClick={() => setEditando(null)} disabled={ocupado}>
                          Voltar
                        </button>
                      </form>
                    ) : p.status === 'EM_ANALISE' ? (
                      <div className="acoes">
                        <button onClick={() => avaliar(p, true)} disabled={ocupado}>Aprovar</button>
                        <button className="perigo" onClick={() => avaliar(p, false)} disabled={ocupado}>Reprovar</button>
                        <button
                          className="secundario"
                          onClick={() => setEditando({ id: p.id, automovelId: p.automovel.id })}
                          disabled={ocupado}
                        >
                          Modificar
                        </button>
                      </div>
                    ) : (
                      <span className="vazio">—</span>
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