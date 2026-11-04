export default function Indicador({ icone: Icone, rotulo, valor, tom = 'azul' }) {
  return (
    <div className={`indicador ${tom}`}>
      <span className="indicador-icone"><Icone aria-hidden="true" /></span>
      <div>
        <p className="indicador-rotulo">{rotulo}</p>
        <p className="indicador-valor">{valor}</p>
      </div>
    </div>
  )
}
