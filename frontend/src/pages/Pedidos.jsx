import { useEffect, useState } from 'react'
import { api } from '../api'
import { STATUS, descricaoAutomovel as descricao } from '../formato'

function mensagemErro(e) {
  return e.status === 409 ? 'Este pedido não pode mais ser alterado.' : e.message
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [automoveis, setAutomoveis] = useState([])
  const [novoAutomovel, setNovoAutomovel] = useState('')
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

  function criar(evento) {
    evento.preventDefault()
    executar(async () => {
      const pedido = await api.criarPedido(Number(novoAutomovel))
      setPedidos((lista) => [...lista, pedido])
      setNovoAutomovel('')
    })
  }

  function salvarModificacao() {
    executar(async () => {
      trocarNaLista(await api.modificarPedido(editando.id, Number(editando.automovelId)))
      setEditando(null)
    })
  }

  function cancelar(pedido) {
    if (!window.confirm(`Cancelar o pedido nº ${pedido.id}?`)) return
    executar(async () => trocarNaLista(await api.cancelarPedido(pedido.id)))
  }

  if (carregando) return <p className="centro">Carregando pedidos…</p>

  const ordenados = [...pedidos].sort((a, b) => b.id - a.id)

  return (
    <main className="cartao">
      <h1>Meus pedidos</h1>

      <form onSubmit={criar}>
        <div className="linha">
          <label>
            Automóvel
            <select value={novoAutomovel} onChange={(e) => setNovoAutomovel(e.target.value)} required>
              <option value="" disabled>Selecione um automóvel</option>
              {automoveis.map((a) => <option key={a.id} value={a.id}>{descricao(a)}</option>)}
            </select>
          </label>
          <button disabled={ocupado}>Fazer pedido</button>
        </div>
      </form>

      {erro && <p className="erro" role="alert">{erro}</p>}

      <h2>Pedidos</h2>
      {ordenados.length === 0 ? (
        <p className="vazio">Você ainda não fez nenhum pedido.</p>
      ) : (
        <div className="tabela">
          <table>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Automóvel</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {editando?.id === p.id ? (
                      <select
                        aria-label={`Novo automóvel do pedido ${p.id}`}
                        value={editando.automovelId}
                        onChange={(e) => setEditando({ ...editando, automovelId: e.target.value })}
                      >
                        {automoveis.map((a) => <option key={a.id} value={a.id}>{descricao(a)}</option>)}
                      </select>
                    ) : (
                      descricao(p.automovel)
                    )}
                  </td>
                  <td><span className={`status ${p.status}`}>{STATUS[p.status] ?? p.status}</span></td>
                  <td>
                    <div className="acoes">
                      {editando?.id === p.id ? (
                        <>
                          <button onClick={salvarModificacao} disabled={ocupado}>Salvar</button>
                          <button className="secundario" onClick={() => setEditando(null)} disabled={ocupado}>Voltar</button>
                        </>
                      ) : (
                        <>
                          {p.status === 'EM_ANALISE' && (
                            <button
                              className="secundario"
                              onClick={() => setEditando({ id: p.id, automovelId: p.automovel.id })}
                              disabled={ocupado}
                            >
                              Modificar
                            </button>
                          )}
                          {(p.status === 'EM_ANALISE' || p.status === 'APROVADO') && (
                            <button className="perigo" onClick={() => cancelar(p)} disabled={ocupado}>Cancelar</button>
                          )}
                          {p.status !== 'EM_ANALISE' && p.status !== 'APROVADO' && <span className="vazio">—</span>}
                        </>
                      )}
                    </div>
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