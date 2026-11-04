import { useEffect, useState } from 'react'
import { api } from './api'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [tela, setTela] = useState('login')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  // Se já houver sessão aberta, entra direto
  useEffect(() => {
    api.usuarioLogado()
      .then(entrar)
      .catch((e) => {
        if (e.status !== 401) setErro(e.message) // 401 = ninguém logado
      })
      .finally(() => setCarregando(false))
  }, [])

  function entrar(usuarioLogado) {
    setUsuario(usuarioLogado)
    setTela('pedidos')
  }

  async function sair() {
    await api.logout().catch(() => {})
    setUsuario(null)
    setTela('login')
  }

  if (carregando) return <p className="centro">Carregando…</p>

  return (
    <>
      <header className="topo">
        <strong> Aluguel de Carros</strong>
        {usuario && (
          <nav>
            <span className="usuario">{usuario.nome} · {usuario.perfil === 'AGENTE' ? 'Agente' : 'Cliente'}</span>
            <button className="secundario" onClick={sair}>Sair</button>
          </nav>
        )}
      </header>

      {erro && <p className="erro centro" role="alert">{erro}</p>}

      {!usuario && tela === 'login' && <Login onEntrar={entrar} onCadastrar={() => setTela('cadastro')} />}
      {!usuario && tela === 'cadastro' && <Cadastro onEntrar={entrar} onVoltar={() => setTela('login')} />}
      {usuario && (
        <main className="cartao">
          <p>Você entrou como <strong>{usuario.nome}</strong>. A tela de pedidos vem no próximo passo.</p>
        </main>
      )}
    </>
  )
}