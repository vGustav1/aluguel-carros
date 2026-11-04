import { useState } from 'react'
import { api } from '../api'
import FormCliente from '../components/FormCliente'

// Cliente consulta, altera e exclui o próprio cadastro
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
    <main className="cartao">
      <h1>Meus dados</h1>
      <p className="vazio">Login: <strong>{usuario.login}</strong></p>
      <FormCliente inicial={usuario} textoBotao="Salvar alterações" onEnviar={salvar} />

      <h2>Excluir conta</h2>
      <p className="vazio">A conta só pode ser excluída se você não tiver pedidos.</p>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <div>
        <button className="perigo" onClick={excluir} disabled={excluindo}>Excluir minha conta</button>
      </div>
    </main>
  )
}