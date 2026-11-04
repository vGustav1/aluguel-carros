import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'

const temaAtual = () => (document.documentElement.dataset.tema === 'escuro' ? 'escuro' : 'claro')

export default function BotaoTema() {
  const [tema, setTema] = useState(temaAtual)
  const escuro = tema === 'escuro'

  function alternar() {
    const novo = escuro ? 'claro' : 'escuro'
    document.documentElement.dataset.tema = novo
    try {
      localStorage.setItem('tema', novo)
    } catch {
      // sem armazenamento no navegador: o tema vale só até recarregar
    }
    setTema(novo)
  }

  const rotulo = escuro ? 'Ativar modo claro' : 'Ativar modo escuro'

  return (
    <button type="button" className="botao-icone tema" onClick={alternar} aria-label={rotulo} title={rotulo}>
      {escuro ? <Sun key="sol" aria-hidden="true" /> : <Moon key="lua" aria-hidden="true" />}
    </button>
  )
}
