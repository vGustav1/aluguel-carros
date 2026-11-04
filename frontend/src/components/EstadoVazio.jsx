export default function EstadoVazio({ icone: Icone, titulo, texto }) {
  return (
    <div className="estado-vazio">
      <span className="estado-vazio-icone"><Icone aria-hidden="true" /></span>
      <strong>{titulo}</strong>
      {texto && <p>{texto}</p>}
    </div>
  )
}
