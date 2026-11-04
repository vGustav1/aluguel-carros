export default function Carregando({ texto = 'Carregando…' }) {
  return (
    <p className="carregando" role="status">
      <span className="giro" aria-hidden="true" />
      {texto}
    </p>
  )
}
