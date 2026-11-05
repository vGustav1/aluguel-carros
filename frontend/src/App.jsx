import { useEffect, useState } from 'react'
import { api } from './api'
import BarraLateral from './components/BarraLateral'
import Carregando from './components/Carregando'
import TopoPublico from './components/TopoPublico'
import Cadastro from './pages/Cadastro'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
import MeusDados from './pages/MeusDados'
import Pedidos from './pages/Pedidos'
import PedidosAgente from './pages/PedidosAgente'
import Design from './pages/Design'

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [tela, setTela] = useState('inicio')
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
    setTela('inicio')
  }

  function trocarTela(nova) {
    setTela(nova)
    window.scrollTo(0, 0)
  }
  
  if (window.location.pathname === '/design') return <Design />
  if (carregando) return <Carregando />

  if (!usuario) {
    return (
      <div className="publico">
        <TopoPublico tela={tela} onTrocarTela={trocarTela} />
        {erro && <p className="erro centro" role="alert">{erro}</p>}
        {tela === 'inicio' && <Inicio onTrocarTela={trocarTela} />}
        {tela !== 'inicio' && (
          <div className="acesso">
            {tela === 'cadastro'
              ? <Cadastro onEntrar={entrar} onVoltar={() => trocarTela('login')} />
              : <Login onEntrar={entrar} onCadastrar={() => trocarTela('cadastro')} />}
          </div>
        )}
      </div>
    )
  }

  const ehCliente = usuario.perfil === 'CLIENTE'

  return (
    <div className="app">
      <BarraLateral usuario={usuario} tela={tela} onTrocarTela={trocarTela} onSair={sair} />
      <div className="conteudo">
        {erro && <p className="erro centro" role="alert">{erro}</p>}
        {ehCliente && tela === 'pedidos' && <Pedidos />}
        {ehCliente && tela === 'dados' && <MeusDados usuario={usuario} onAtualizar={setUsuario} onExcluir={sair} />}
        {!ehCliente && <PedidosAgente />}
      </div>
    </div>
  )
}
