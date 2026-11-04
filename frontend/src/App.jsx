import { useEffect, useState } from 'react'
import { api } from './api'
import Apresentacao from './components/Apresentacao'
import BotaoTema from './components/BotaoTema'
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
        <span className="logo" role="img" aria-label="Locar · Locadora de Carros" />
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
        <div className="conta">
          {usuario && (
            <span className="usuario">
              <strong>{usuario.nome}</strong>
              {ehCliente ? 'Cliente' : 'Agente'}
            </span>
          )}
          <BotaoTema />
          {usuario && <button className="secundario" onClick={sair}>Sair</button>}
        </div>
      </header>

      {erro && <p className="erro centro" role="alert">{erro}</p>}

      {!usuario && (
        <div className={tela === 'cadastro' ? 'acesso cadastro' : 'acesso'}>
          <Apresentacao />
          {tela === 'cadastro'
            ? <Cadastro onEntrar={entrar} onVoltar={() => setTela('login')} />
            : <Login onEntrar={entrar} onCadastrar={() => setTela('cadastro')} />}
        </div>
      )}
      {ehCliente && tela === 'pedidos' && <Pedidos />}
      {ehCliente && tela === 'dados' && <MeusDados usuario={usuario} onAtualizar={setUsuario} onExcluir={sair} />}
      {usuario?.perfil === 'AGENTE' && <PedidosAgente />}
    </>
  )
}