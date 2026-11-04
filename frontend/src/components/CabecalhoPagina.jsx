export default function CabecalhoPagina({ icone: Icone, titulo, descricao }) {
  return (
    <header className="pagina-topo">
      <span className="pagina-icone"><Icone aria-hidden="true" /></span>
      <div>
        <h1>{titulo}</h1>
        {descricao && <p>{descricao}</p>}
      </div>
    </header>
  )
}
