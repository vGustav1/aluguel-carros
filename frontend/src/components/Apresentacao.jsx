const DESTAQUES = [
  'Crie, modifique e cancele pedidos de aluguel pela internet',
  'Pedidos analisados por empresas e bancos parceiros',
  'Acompanhe o status de cada pedido',
]

export default function Apresentacao() {
  return (
    <aside className="apresentacao">
      <p className="sobretitulo">Locadora de carros</p>
      <h2>Aluguel de automóveis sem burocracia</h2>
      <p>Cadastre-se uma vez e faça seus pedidos de onde estiver.</p>
      <ul>
        {DESTAQUES.map((texto) => (
          <li key={texto}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
            {texto}
          </li>
        ))}
      </ul>
    </aside>
  )
}