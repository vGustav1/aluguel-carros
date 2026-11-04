import { UserPlus } from 'lucide-react'
import { api } from '../api'
import FormCliente from '../components/FormCliente'

export default function Cadastro({ onEntrar, onVoltar }) {
  async function cadastrar(dados) {
    try {
      await api.cadastrarCliente(dados)
    } catch (e) {
      throw new Error(e.status === 409 ? 'Este login já está em uso. Escolha outro.' : e.message)
    }
    await api.login(dados.login, dados.senha)
    onEntrar(await api.usuarioLogado())
  }

  return (
    <main className="cartao acesso-cartao largo">
      <span className="acesso-icone"><UserPlus aria-hidden="true" /></span>
      <h1>Criar conta</h1>
      <p className="subtitulo">Cadastre-se uma vez e faça seus pedidos de aluguel de onde estiver.</p>
      <FormCliente comAcesso textoBotao="Criar conta" onEnviar={cadastrar} />
      <p className="rodape">
        Já tem conta? <button type="button" className="link" onClick={onVoltar}>Entrar</button>
      </p>
    </main>
  )
}
