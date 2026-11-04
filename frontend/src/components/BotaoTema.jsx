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
    <button type="button" className="botao-icone" onClick={alternar} aria-label={rotulo} title={rotulo}>
      {escuro ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}