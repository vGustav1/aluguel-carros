import { Briefcase, Trash2, TriangleAlert, UserRound } from 'lucide-react'
import { useState } from 'react'
import { api } from '../api'
import Avatar from '../components/Avatar'
import Aviso from '../components/Aviso'
import CabecalhoPagina from '../components/CabecalhoPagina'
import FormCliente from '../components/FormCliente'

export default function MeusDados({ usuario, onAtualizar, onExcluir }) {
  const [erro, setErro] = useState('')
  const [excluindo, setExcluindo] = useState(false)

  async function salvar(dados) {
    onAtualizar(await api.atualizarCliente(usuario.id, dados))
    return 'Dados atualizados.'
  }

  async function excluir() {
    if (!window.confirm('Excluir sua conta? Esta ação não pode ser desfeita.')) return
    setErro('')
    setExcluindo(true)
    try {
      await api.excluirCliente(usuario.id)
      onExcluir()
    } catch (e) {
      setErro(e.status === 409 ? 'Sua conta tem pedidos registrados e por isso não pode ser excluída.' : e.message)
      setExcluindo(false)
    }
  }

  return (
    <main className="pagina">
      <CabecalhoPagina
        icone={UserRound}
        titulo="Meus dados"
        descricao="Mantenha seu cadastro atualizado para agilizar a análise dos pedidos."
      />

      <section className="cartao perfil">
        <Avatar nome={usuario.nome} grande />
        <div>
          <h2>{usuario.nome}</h2>
          <p>@{usuario.login} · Cliente</p>
        </div>
        {usuario.profissao && (
          <span className="etiqueta"><Briefcase aria-hidden="true" />{usuario.profissao}</span>
        )}
      </section>

      <section className="cartao">
        <FormCliente inicial={usuario} textoBotao="Salvar alterações" onEnviar={salvar} />
      </section>

      <section className="cartao zona-perigo">
        <div className="zona-perigo-texto">
          <TriangleAlert aria-hidden="true" />
          <div>
            <h2>Excluir conta</h2>
            <p>A conta só pode ser excluída se você não tiver pedidos. Esta ação não pode ser desfeita.</p>
          </div>
        </div>
        <button className="perigo" onClick={excluir} disabled={excluindo}>
          <Trash2 aria-hidden="true" />
          Excluir minha conta
        </button>
        {erro && <Aviso>{erro}</Aviso>}
      </section>
    </main>
  )
}
