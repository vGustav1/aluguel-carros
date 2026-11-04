import { ArrowRight, Lock, LogIn, User } from 'lucide-react'
import { useState } from 'react'
import { api } from '../api'
import Aviso from '../components/Aviso'

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
    <main className="cartao acesso-cartao">
      <span className="acesso-icone"><LogIn aria-hidden="true" /></span>
      <h1>Entrar</h1>
      <p className="subtitulo">Acesse com seu login e senha para continuar.</p>
      <form onSubmit={entrar}>
        <label>
          Login
          <span className="campo-icone">
            <User aria-hidden="true" />
            <input value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" required autoFocus />
          </span>
        </label>
        <label>
          Senha
          <span className="campo-icone">
            <Lock aria-hidden="true" />
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" required />
          </span>
        </label>
        {erro && <Aviso>{erro}</Aviso>}
        <button className="botao-grande" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
          <ArrowRight aria-hidden="true" />
        </button>
      </form>
      <p className="rodape">
        Ainda não tem conta? <button type="button" className="link" onClick={onCadastrar}>Cadastre-se</button>
      </p>
    </main>
  )
}
