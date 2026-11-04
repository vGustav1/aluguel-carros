import { useState } from 'react'
import { api } from '../api'

export default function Login({ onEntrar, onCadastrar }) {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function entrar(evento) {
    evento.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await api.login(login, senha)
      onEntrar(await api.usuarioLogado())
    } catch (e) {
      setErro(e.status === 401 ? 'Login ou senha inválidos.' : e.message)
      setEnviando(false)
    }
  }

  return (
    <main className="cartao estreito">
      <h1>Entrar</h1>
      <form onSubmit={entrar}>
        <label>
          Login
          <input value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" required autoFocus />
        </label>
        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" required />
        </label>
        {erro && <p className="erro" role="alert">{erro}</p>}
        <button disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
      </form>
      <p className="rodape">
        Ainda não tem conta? <button type="button" className="link" onClick={onCadastrar}>Cadastre-se</button>
      </p>
    </main>
  )
}