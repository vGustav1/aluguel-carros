import { ClipboardCheck, ClipboardList, LogOut, UserRound } from 'lucide-react'
import Avatar from './Avatar'
import BotaoTema from './BotaoTema'

const MENU = {
  CLIENTE: [
    { id: 'pedidos', nome: 'Meus pedidos', icone: ClipboardList },
    { id: 'dados', nome: 'Meus dados', icone: UserRound },
  ],
  AGENTE: [{ id: 'pedidos', nome: 'Pedidos', icone: ClipboardCheck }],
}

export default function BarraLateral({ usuario, tela, onTrocarTela, onSair }) {
  return (
    <aside className="lateral">
      <span className="logo" role="img" aria-label="Locar · Locadora de Carros" />
      <nav aria-label="Menu principal">
        <p className="lateral-secao">Menu</p>
        {MENU[usuario.perfil].map(({ id, nome, icone: Icone }) => (
          <button
            key={id}
            className={tela === id ? 'menu-item ativo' : 'menu-item'}
            aria-current={tela === id ? 'page' : undefined}
            onClick={() => onTrocarTela(id)}
          >
            <Icone aria-hidden="true" />
            {nome}
          </button>
        ))}
      </nav>
      <div className="lateral-rodape">
        <div className="lateral-usuario">
          <Avatar nome={usuario.nome} />
          <div>
            <strong>{usuario.nome}</strong>
            <span>{usuario.perfil === 'CLIENTE' ? 'Cliente' : 'Agente'}</span>
          </div>
        </div>
        <div className="lateral-acoes">
          <BotaoTema />
          <button type="button" className="sair" onClick={onSair}>
            <LogOut aria-hidden="true" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  )
}
