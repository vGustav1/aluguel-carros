import { api } from '../api'
import FormCliente from '../components/FormCliente'

export default function Cadastro({ onEntrar, onVoltar }) {
  async function cadastrar(dados) {
    try {
      await api.cadastrarCliente(dados)
    } catch (e) {
      throw new Error(e.status === 409 ? 'Este login já está em uso. Escolha outro.' : e.message)
    }
    // Conta criada: já entra no sistema
    await api.login(dados.login, dados.senha)
    onEntrar(await api.usuarioLogado())
  }

  return (
    <main className="cartao">
      <h1>Criar conta de cliente</h1>
      <FormCliente comAcesso textoBotao="Criar conta" onEnviar={cadastrar} />
      <p className="rodape">
        Já tem conta? <button type="button" className="link" onClick={onVoltar}>Entrar</button>
      </p>
    </main>
  )
}