import { Ban, CarFront, CircleCheck, CirclePlus, ClipboardList, Clock, History, Inbox, Pencil, Send, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../api'
import Aviso from '../components/Aviso'
import CabecalhoPagina from '../components/CabecalhoPagina'
import Carregando from '../components/Carregando'
import EstadoVazio from '../components/EstadoVazio'
import Indicador from '../components/Indicador'
import StatusPedido from '../components/StatusPedido'
import { contarPorStatus, descricaoAutomovel, numeroPedido } from '../formato'

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
    if (!window.confirm(`Cancelar o pedido ${numeroPedido(pedido.id)}?`)) return
    executar(async () => trocarNaLista(await api.cancelarPedido(pedido.id)))
  }

  if (carregando) return <Carregando texto="Carregando pedidos…" />

  const ordenados = [...pedidos].sort((a, b) => b.id - a.id)

  return (
    <main className="pagina">
      <CabecalhoPagina
        icone={ClipboardList}
        titulo="Meus pedidos"
        descricao="Escolha um automóvel, envie o pedido e acompanhe a análise."
      />

      <div className="indicadores">
        <Indicador icone={ClipboardList} rotulo="Total de pedidos" valor={pedidos.length} />
        <Indicador icone={Clock} rotulo="Em análise" valor={contarPorStatus(pedidos, 'EM_ANALISE')} tom="amarelo" />
        <Indicador icone={CircleCheck} rotulo="Aprovados" valor={contarPorStatus(pedidos, 'APROVADO')} tom="verde" />
        <Indicador icone={Ban} rotulo="Reprovados ou cancelados" valor={contarPorStatus(pedidos, 'REPROVADO', 'CANCELADO')} tom="vermelho" />
      </div>

      <section className="cartao">
        <div className="cartao-topo">
          <h2><CirclePlus aria-hidden="true" />Novo pedido</h2>
          <p>Selecione o automóvel que deseja alugar.</p>
        </div>
        <form onSubmit={criar}>
          <fieldset className="carros">
            <legend className="sr-only">Automóvel</legend>
            {automoveis.map((a) => {
              const selecionado = novoAutomovel === String(a.id)
              return (
                <label key={a.id} className={selecionado ? 'carro selecionado' : 'carro'}>
                  <input
                    type="radio" name="automovel" value={a.id} checked={selecionado}
                    onChange={(e) => setNovoAutomovel(e.target.value)} required
                  />
                  <span className="carro-icone"><CarFront aria-hidden="true" /></span>
                  <span className="carro-nome">{a.marca} {a.modelo}</span>
                  <span className="carro-detalhe">{a.ano} · {a.placa}</span>
                  <span className="carro-detalhe">Matrícula {a.matricula}</span>
                  <CircleCheck className="carro-check" aria-hidden="true" />
                </label>
              )
            })}
          </fieldset>
          <div className="formulario-acoes">
            <button disabled={ocupado || !novoAutomovel}>
              <Send aria-hidden="true" />
              Fazer pedido
            </button>
          </div>
        </form>
      </section>

      {erro && <Aviso>{erro}</Aviso>}

      <section className="cartao">
        <div className="cartao-topo">
          <h2><History aria-hidden="true" />Histórico de pedidos</h2>
        </div>
        {ordenados.length === 0 ? (
          <EstadoVazio icone={Inbox} titulo="Você ainda não fez nenhum pedido" texto="Escolha um automóvel acima para começar." />
        ) : (
          <div className="tabela">
            <table>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Automóvel</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {ordenados.map((p, i) => (
                  <tr key={p.id} style={{ '--i': i }}>
                    <td className="numero">{numeroPedido(p.id)}</td>
                    <td>
                      {editando?.id === p.id ? (
                        <select
                          aria-label={`Novo automóvel do pedido ${numeroPedido(p.id)}`}
                          value={editando.automovelId}
                          onChange={(e) => setEditando({ ...editando, automovelId: e.target.value })}
                        >
                          {automoveis.map((a) => <option key={a.id} value={a.id}>{descricaoAutomovel(a)}</option>)}
                        </select>
                      ) : (
                        <span className="celula-carro">
                          <span className="mini-icone"><CarFront aria-hidden="true" /></span>
                          <span>
                            <strong>{p.automovel.marca} {p.automovel.modelo}</strong>
                            <span className="detalhe">{p.automovel.ano} · {p.automovel.placa}</span>
                          </span>
                        </span>
                      )}
                    </td>
                    <td><StatusPedido status={p.status} /></td>
                    <td>
                      <div className="acoes">
                        {editando?.id === p.id ? (
                          <>
                            <button className="pequeno" onClick={salvarModificacao} disabled={ocupado}>Salvar</button>
                            <button className="secundario pequeno" onClick={() => setEditando(null)} disabled={ocupado}>Voltar</button>
                          </>
                        ) : (
                          <>
                            {p.status === 'EM_ANALISE' && (
                              <button
                                className="secundario pequeno"
                                onClick={() => setEditando({ id: p.id, automovelId: p.automovel.id })}
                                disabled={ocupado}
                              >
                                <Pencil aria-hidden="true" />
                                Modificar
                              </button>
                            )}
                            {(p.status === 'EM_ANALISE' || p.status === 'APROVADO') && (
                              <button className="perigo pequeno" onClick={() => cancelar(p)} disabled={ocupado}>
                                <X aria-hidden="true" />
                                Cancelar
                              </button>
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
      </section>
    </main>
  )
}
