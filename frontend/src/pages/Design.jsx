import { ArrowRight, Pencil, User } from 'lucide-react'
import Avatar from '../components/Avatar'
import Aviso from '../components/Aviso'
import BotaoTema from '../components/BotaoTema'
import StatusPedido from '../components/StatusPedido'
import { STATUS } from '../formato'
import './Design.css'

// Mesmos valores de :root (claro) e :root[data-tema='escuro'] no index.css
const CORES = [
  ['--marca', 'Logo e títulos', '#012556', '#dce7f9'],
  ['--primaria', 'Botões principais e pílula ativa', '#0b3a82', '#2563eb'],
  ['--primaria-hover', 'Hover dos botões principais', '#012556', '#1d4fd0'],
  ['--foco', 'Foco, links e ícones de destaque', '#2f6fe0', '#6c9cff'],
  ['--fundo', 'Fundo da página', '#f3f6fb', '#050c18'],
  ['--fundo-alt', 'Faixas e rodapé', '#e8eef8', '#0a1528'],
  ['--superficie', 'Cartões, campos e tabelas', '#ffffff', '#0d1a2e'],
  ['--superficie-2', 'Cabeçalho de tabela e áreas internas', '#eef3fa', '#14243d'],
  ['--texto', 'Texto principal', '#0b1b33', '#e6edf7'],
  ['--suave', 'Texto de apoio e legendas', '#55667f', '#93a5bf'],
  ['--borda', 'Borda padrão', '#d6dfeb', '#1f3354'],
  ['--borda-forte', 'Borda em hover e contornos', '#b8c6da', '#2e4870'],
  ['--erro', 'Erros e ações perigosas', '#b42318', '#ff8a80'],
  ['--sucesso', 'Mensagens de sucesso', '#067647', '#6ce9a6'],
]

const TIPOGRAFIA = [
  { nome: 'Título de página', regra: 'Cinzel · 700 · 1.75rem', exemplo: <p className="tipo-h1">Meus pedidos</p> },
  { nome: 'Título de seção', regra: 'Cinzel · 600 · até 2.4rem', exemplo: <p className="titulo-secao tipo-titulo">Como funciona</p> },
  { nome: 'Título de cartão', regra: 'Cinzel · 600 · 1.125rem', exemplo: <p className="tipo-h2">Histórico de pedidos</p> },
  { nome: 'Sobretítulo', regra: 'Inter · 700 · 0.75rem · maiúsculas', exemplo: <p className="sobretitulo">Passo a passo</p> },
  { nome: 'Corpo', regra: 'Inter · 400 · 15px', exemplo: <p>Escolha um automóvel, envie o pedido e acompanhe a análise.</p> },
  { nome: 'Rótulo', regra: 'Inter · 600 · 0.8125rem', exemplo: <p className="tipo-rotulo">Entidade empregadora</p> },
  { nome: 'Legenda', regra: 'Inter · 400 · 0.8125rem · cor suave', exemplo: <p className="detalhe">2024 · ABC1D23</p> },
]

const ESPACOS = [4, 8, 12, 16, 20, 24, 32]

const RAIOS = [
  ['8px', 'Botão pequeno'],
  ['10px', 'Botões e campos'],
  ['14px', 'Tabela e carro'],
  ['18px', 'Cartões'],
  ['28px', 'Vitrine do início'],
  ['999px', 'Pílulas e status'],
]

const SOMBRAS = [
  ['--sombra-leve', 'Indicadores e itens em repouso'],
  ['--sombra', 'Cartões e hover'],
]

function Secao({ sobretitulo, titulo, children }) {
  return (
    <section className="design-secao">
      <div>
        <p className="sobretitulo">{sobretitulo}</p>
        <h2 className="titulo-secao">{titulo}</h2>
      </div>
      {children}
    </section>
  )
}

function Cor({ valor }) {
  return (
    <span className="cor">
      <span className="amostra" style={{ background: valor }} />
      {valor}
    </span>
  )
}

export default function Design() {
  return (
    <div className="design">
      <header className="design-topo">
        <span className="logo" role="img" aria-label="Locar · Locadora de Carros" />
        <div className="design-topo-acoes">
          <BotaoTema />
          <button type="button" className="contorno" onClick={() => window.location.assign('/')}>
            Voltar ao início
          </button>
        </div>
      </header>

      <main className="design-conteudo">
        <section className="design-hero">
          <p className="sobretitulo">Documentação do design system</p>
          <h1>Locar</h1>
          <p>
            Esta página reúne as decisões visuais do front-end: cores, tipografia, espaçamentos, bordas,
            sombras e componentes. Use o botão de tema para ver tudo no modo claro e no escuro.
          </p>
        </section>

        <Secao sobretitulo="Paleta" titulo="Cores nos temas claro e escuro">
          <div className="tabela">
            <table>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Uso</th>
                  <th>Claro</th>
                  <th>Escuro</th>
                </tr>
              </thead>
              <tbody>
                {CORES.map(([token, uso, claro, escuro]) => (
                  <tr key={token}>
                    <td><code>{token}</code></td>
                    <td>{uso}</td>
                    <td><Cor valor={claro} /></td>
                    <td><Cor valor={escuro} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Secao>

        <Secao sobretitulo="Tipografia" titulo="Cinzel nos títulos, Inter no texto">
          <div className="cartao">
            {TIPOGRAFIA.map(({ nome, regra, exemplo }) => (
              <div className="tipo-linha" key={nome}>
                <div>
                  <strong>{nome}</strong>
                  <span className="detalhe">{regra}</span>
                </div>
                {exemplo}
              </div>
            ))}
          </div>
        </Secao>

        <Secao sobretitulo="Medidas" titulo="Espaçamentos e bordas">
          <div className="design-grade">
            <div className="cartao">
              <h3>Escala de espaçamento</h3>
              <div className="espacos">
                {ESPACOS.map((valor) => (
                  <div className="espaco" key={valor}>
                    <span>{valor}px</span>
                    <span className="espaco-barra" style={{ width: valor * 4 }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="cartao">
              <h3>Arredondamentos</h3>
              <div className="raios">
                {RAIOS.map(([valor, uso]) => (
                  <div className="raio" key={valor}>
                    <span className="raio-caixa" style={{ borderRadius: valor }} />
                    <strong>{valor}</strong>
                    <span>{uso}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Secao>

        <Secao sobretitulo="Profundidade" titulo="Sombras">
          <div className="design-grade">
            {SOMBRAS.map(([token, uso]) => (
              <div className="sombra-caixa" key={token} style={{ boxShadow: `var(${token})` }}>
                <code>{token}</code>
                <span className="detalhe">{uso}</span>
              </div>
            ))}
          </div>
        </Secao>

        <Secao sobretitulo="Componentes" titulo="Botões, status e avisos">
          <div className="cartao componentes">
            <h3>Botões</h3>
            <div className="componentes-linha">
              <button type="button">Primário</button>
              <button type="button" className="secundario">Secundário</button>
              <button type="button" className="contorno">Contorno</button>
              <button type="button" className="perigo">Perigo</button>
              <button type="button" className="aprovar">Aprovar</button>
              <button type="button" disabled>Desabilitado</button>
              <button type="button" className="link">Link</button>
            </div>
            <div className="componentes-linha">
              <button type="button" className="botao-grande">
                Criar conta
                <ArrowRight aria-hidden="true" />
              </button>
              <button type="button" className="pequeno">Pequeno</button>
              <button type="button" className="botao-icone" aria-label="Editar">
                <Pencil aria-hidden="true" />
              </button>
              <button type="button" className="pilula ativa">Todos <span className="contagem">8</span></button>
              <button type="button" className="pilula">Em análise <span className="contagem">3</span></button>
            </div>

            <h3>Status dos pedidos</h3>
            <div className="componentes-linha">
              {Object.keys(STATUS).map((status) => <StatusPedido key={status} status={status} />)}
            </div>

            <h3>Avisos</h3>
            <Aviso>Login ou senha inválidos.</Aviso>
            <Aviso tipo="sucesso">Dados atualizados.</Aviso>

            <h3>Campo e avatar</h3>
            <div className="componentes-linha">
              <label className="campo-exemplo">
                Login
                <span className="campo-icone">
                  <User aria-hidden="true" />
                  <input placeholder="seu login" />
                </span>
              </label>
              <Avatar nome="Maria Silva" />
              <Avatar nome="Maria Silva" grande />
            </div>
          </div>
        </Secao>

        <Secao sobretitulo="Marca" titulo="Logo em fundo claro e escuro">
          <div className="design-grade">
            <div className="logo-painel painel-claro">
              <span className="logo" aria-hidden="true" />
              <span>Fundo claro</span>
            </div>
            <div className="logo-painel painel-escuro">
              <span className="logo" aria-hidden="true" />
              <span>Fundo escuro</span>
            </div>
          </div>
        </Secao>
      </main>
    </div>
  )
}