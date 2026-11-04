import { useEffect, useState } from 'react'
import { api } from './api'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import MeusDados from './pages/MeusDados'
import Pedidos from './pages/Pedidos'
import PedidosAgente from './pages/PedidosAgente'

const ABAS_CLIENTE = [
  ['pedidos', 'Meus pedidos'],
  ['dados', 'Meus dados'],
]

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

  const ehCliente = usuario?.perfil === 'CLIENTE'

  return (
    <>
      <header className="topo">
        <strong> Aluguel de Carros</strong>
        {ehCliente && (
          <nav aria-label="Telas">
            {ABAS_CLIENTE.map(([id, nome]) => (
              <button
                key={id}
                className={tela === id ? 'aba ativa' : 'aba'}
                aria-current={tela === id ? 'page' : undefined}
                onClick={() => setTela(id)}
              >
                {nome}
              </button>
            ))}
          </nav>
        )}
        {usuario && (
          <div className="conta">
            <span className="usuario">{usuario.nome} · {ehCliente ? 'Cliente' : 'Agente'}</span>
            <button className="secundario" onClick={sair}>Sair</button>
          </div>
        )}
      </header>

      {erro && <p className="erro centro" role="alert">{erro}</p>}

      {!usuario && tela === 'login' && <Login onEntrar={entrar} onCadastrar={() => setTela('cadastro')} />}
      {!usuario && tela === 'cadastro' && <Cadastro onEntrar={entrar} onVoltar={() => setTela('login')} />}
      {ehCliente && tela === 'pedidos' && <Pedidos />}
      {ehCliente && tela === 'dados' && <MeusDados usuario={usuario} onAtualizar={setUsuario} onExcluir={sair} />}
      {usuario?.perfil === 'AGENTE' && <PedidosAgente />}
    </>
  )
}