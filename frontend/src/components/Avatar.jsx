const iniciais = (nome = '') =>
  nome.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((parte) => parte[0].toUpperCase()).join('') || '?'

export default function Avatar({ nome, grande = false }) {
  return <span className={grande ? 'avatar grande' : 'avatar'} aria-hidden="true">{iniciais(nome)}</span>
}
