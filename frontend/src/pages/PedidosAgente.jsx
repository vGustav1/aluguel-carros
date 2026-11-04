import { Check, CircleCheck, CircleX, ClipboardCheck, Clock, Inbox, Layers, Pencil, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../api'
import Avatar from '../components/Avatar'
import Aviso from '../components/Aviso'
import CabecalhoPagina from '../components/CabecalhoPagina'
import Carregando from '../components/Carregando'
import EstadoVazio from '../components/EstadoVazio'
import Indicador from '../components/Indicador'
import StatusPedido from '../components/StatusPedido'
import { STATUS, contarPorStatus, descricaoAutomovel, moeda, numeroPedido, rendaTotal } from '../formato'

const FILTROS = [['TODOS', 'Todos'], ...Object.entries(STATUS)]

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
    if (!aprovado && !window.confirm(`Reprovar o pedido ${numeroPedido(pedido.id)}?`)) return
    executar(async () => trocarNaLista(await api.avaliarPedido(pedido.id, aprovado)))
  }

  function salvarModificacao(evento) {
    evento.preventDefault()
    executar(async () => {
      trocarNaLista(await api.modificarPedido(editando.id, Number(editando.automovelId)))
      setEditando(null)
    })
  }

  if (carregando) return <Carregando texto="Carregando pedidos…" />

  const contar = (valor) => (valor === 'TODOS' ? pedidos.length : contarPorStatus(pedidos, valor))
  const visiveis = pedidos
    .filter((p) => filtro === 'TODOS' || p.status === filtro)
    .sort((a, b) => b.id - a.id)

  return (
    <main className="pagina larga">
      <CabecalhoPagina
        icone={ClipboardCheck}
        titulo="Pedidos de aluguel"
        descricao="Analise a renda de cada cliente e aprove ou reprove os pedidos em análise."
      />

      <div className="indicadores">
        <Indicador icone={Clock} rotulo="Aguardando análise" valor={contar('EM_ANALISE')} tom="amarelo" />
        <Indicador icone={CircleCheck} rotulo="Aprovados" valor={contar('APROVADO')} tom="verde" />
        <Indicador icone={CircleX} rotulo="Reprovados" valor={contar('REPROVADO')} tom="vermelho" />
        <Indicador icone={Layers} rotulo="Total de pedidos" valor={contar('TODOS')} />
      </div>

      {erro && <Aviso>{erro}</Aviso>}

      <section className="cartao">
        <div className="cartao-topo com-filtros">
          <h2><ClipboardCheck aria-hidden="true" />Pedidos</h2>
          <div className="filtros" role="group" aria-label="Filtrar por status">
            {FILTROS.map(([valor, nome]) => (
              <button
                key={valor} type="button" aria-pressed={filtro === valor}
                className={filtro === valor ? 'pilula ativa' : 'pilula'} onClick={() => setFiltro(valor)}
              >
                {nome}
                <span className="contagem">{contar(valor)}</span>
              </button>
            ))}
          </div>
        </div>

        {visiveis.length === 0 ? (
          <EstadoVazio icone={Inbox} titulo="Nenhum pedido encontrado" texto="Não há pedidos com esse status no momento." />
        ) : (
          <div className="tabela">
            <table>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Renda mensal</th>
                  <th>Automóvel</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {visiveis.map((p, i) => (
                  <tr key={p.id} style={{ '--i': i }}>
                    <td className="numero">{numeroPedido(p.id)}</td>
                    <td>
                      <span className="celula-cliente">
                        <Avatar nome={p.cliente.nome} />
                        <span>
                          <strong>{p.cliente.nome}</strong>
                          <span className="detalhe">CPF {p.cliente.cpf}</span>
                        </span>
                      </span>
                    </td>
                    <td>
                      <strong>{moeda(rendaTotal(p.cliente))}</strong>
                      <span className="detalhe">{p.cliente.profissao}</span>
                    </td>
                    <td>
                      <strong>{p.automovel.marca} {p.automovel.modelo}</strong>
                      <span className="detalhe">{p.automovel.ano} · {p.automovel.placa}</span>
                    </td>
                    <td><StatusPedido status={p.status} /></td>
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
                          <button className="pequeno" disabled={ocupado}>Salvar</button>
                          <button type="button" className="secundario pequeno" onClick={() => setEditando(null)} disabled={ocupado}>
                            Voltar
                          </button>
                        </form>
                      ) : p.status === 'EM_ANALISE' ? (
                        <div className="acoes">
                          <button className="aprovar pequeno" onClick={() => avaliar(p, true)} disabled={ocupado}>
                            <Check aria-hidden="true" />
                            Aprovar
                          </button>
                          <button className="perigo pequeno" onClick={() => avaliar(p, false)} disabled={ocupado}>
                            <X aria-hidden="true" />
                            Reprovar
                          </button>
                          <button
                            className="botao-icone pequeno"
                            onClick={() => setEditando({ id: p.id, automovelId: p.automovel.id })}
                            disabled={ocupado} aria-label="Modificar" title="Modificar automóvel"
                          >
                            <Pencil aria-hidden="true" />
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
      </section>
    </main>
  )
}
