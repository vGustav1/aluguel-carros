import {
  ArrowRight, BadgeCheck, Building2, CarFront, CircleCheck, ClipboardList, Clock, KeyRound,
  Landmark, ShieldCheck, Sparkles, UserPlus, UserRound, Wallet,
} from 'lucide-react'
import { useEffect } from 'react'
import StatusPedido from '../components/StatusPedido'

const FATOS = [
  { icone: Wallet, texto: 'Até 3 rendimentos por cadastro' },
  { icone: Landmark, texto: 'Avaliação por empresas e bancos' },
  { icone: KeyRound, texto: 'Acesso com login e senha' },
]

const RECURSOS = [
  { icone: Landmark, titulo: 'Análise financeira', texto: 'Empresas e bancos avaliam cada pedido com base nos seus rendimentos.' },
  { icone: Clock, titulo: 'Status sempre visível', texto: 'Em análise, aprovado, reprovado ou cancelado: você sabe na hora.' },
  { icone: ShieldCheck, titulo: 'Acesso protegido', texto: 'Só usuários cadastrados entram, com senha guardada de forma criptografada.' },
  { icone: CarFront, titulo: 'Frota identificada', texto: 'Cada automóvel com matrícula, ano, marca, modelo e placa.' },
]

const EXEMPLO = [
  { numero: '#0007', carro: 'Fiat Argo', status: 'EM_ANALISE' },
  { numero: '#0006', carro: 'Volkswagen Polo', status: 'APROVADO' },
  { numero: '#0005', carro: 'Chevrolet Onix', status: 'APROVADO' },
]

const PASSOS = [
  { icone: UserPlus, titulo: 'Crie sua conta', texto: 'Informe seus dados e até três rendimentos.' },
  { icone: CarFront, titulo: 'Escolha o automóvel', texto: 'Selecione o carro e envie o pedido.' },
  { icone: ShieldCheck, titulo: 'Análise do agente', texto: 'Uma empresa ou banco avalia o pedido.' },
  { icone: CircleCheck, titulo: 'Acompanhe', texto: 'Veja o resultado na sua área de pedidos.' },
]

const PUBLICOS = [
  {
    classe: 'publico-cartao',
    icone: UserRound,
    titulo: 'Clientes',
    texto: 'Para quem quer alugar um automóvel.',
    itens: ['Cadastro com até três rendimentos', 'Pedidos criados, modificados e cancelados online', 'Status de cada pedido sempre à vista', 'Dados pessoais atualizados quando quiser'],
  },
  {
    classe: 'publico-cartao agentes',
    icone: Building2,
    titulo: 'Empresas e bancos',
    texto: 'Para os agentes que analisam os pedidos.',
    itens: ['Todos os pedidos em um só lugar, com filtros', 'Renda do cliente ao lado de cada pedido', 'Aprovação ou reprovação direto na lista de pedidos', 'Troca do automóvel enquanto o pedido está em análise'],
  },
]

export default function Inicio({ onTrocarTela }) {
  useEffect(() => {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel')
          observador.unobserve(entrada.target)
        }
      })
    }, { threshold: 0.15 })
    document.querySelectorAll('.revelar').forEach((elemento) => observador.observe(elemento))
    return () => observador.disconnect()
  }, [])

  return (
    <main>
      <section className="hero">
        <div className="hero-centro">
          <span className="selo"><Sparkles aria-hidden="true" />Pedidos de aluguel 100% online</span>
          <h1>O carro certo,<br />sem burocracia</h1>
          <p>Faça seu pedido de aluguel pela internet e acompanhe cada etapa da análise, do envio até a aprovação.</p>
          <div className="hero-acoes">
            <button className="botao-grande" onClick={() => onTrocarTela('cadastro')}>
              Criar conta
              <ArrowRight aria-hidden="true" />
            </button>
            <button className="botao-grande contorno" onClick={() => onTrocarTela('login')}>Já tenho conta</button>
          </div>
        </div>

        <div className="vitrine" aria-hidden="true">
          <div className="hero-brilho" />
          <div className="hero-carro-sombra"><div className="hero-carro" /></div>
          <div className="hero-estrada" />
          <div className="hero-chip um"><ShieldCheck />Análise financeira</div>
          <div className="hero-chip dois"><Clock />Pedido em análise</div>
          <div className="hero-chip tres"><CircleCheck />Pedido aprovado</div>
        </div>

        <ul className="fatos">
          {FATOS.map(({ icone: Icone, texto }) => (
            <li key={texto}><Icone aria-hidden="true" />{texto}</li>
          ))}
        </ul>
      </section>

      <section className="secao" id="recursos">
        <div className="secao-cabecalho revelar">
          <p className="sobretitulo">Recursos</p>
          <h2 className="titulo-secao">Tudo o que o aluguel precisa</h2>
          <p>Do cadastro à decisão do agente, cada etapa acontece dentro do sistema.</p>
        </div>
        <div className="mosaico">
          <article className="mosaico-item destaque revelar">
            <div>
              <span className="recurso-icone"><ClipboardList aria-hidden="true" /></span>
              <h3>Pedidos pela internet</h3>
              <p>Escolha o automóvel, envie o pedido e modifique ou cancele enquanto ele estiver em análise.</p>
            </div>
            <div className="miniatura" aria-hidden="true">
              {EXEMPLO.map(({ numero, carro, status }) => (
                <div className="miniatura-linha" key={numero}>
                  <span className="mini-icone"><CarFront /></span>
                  <span><strong>{carro}</strong><span className="detalhe">{numero}</span></span>
                  <StatusPedido status={status} />
                </div>
              ))}
            </div>
          </article>
          {RECURSOS.map(({ icone: Icone, titulo, texto }, i) => (
            <article className="mosaico-item revelar" key={titulo} style={{ transitionDelay: `${(i + 1) * 70}ms` }}>
              <span className="recurso-icone"><Icone aria-hidden="true" /></span>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="faixa" id="como-funciona">
        <div className="secao">
          <div className="secao-cabecalho centralizado revelar">
            <p className="sobretitulo">Passo a passo</p>
            <h2 className="titulo-secao">Como funciona</h2>
          </div>
          <ol className="linha-tempo">
            {PASSOS.map(({ icone: Icone, titulo, texto }, i) => (
              <li className="revelar" key={titulo} style={{ transitionDelay: `${i * 90}ms` }}>
                <span className="no"><Icone aria-hidden="true" /></span>
                <span className="etapa">Etapa {String(i + 1).padStart(2, '0')}</span>
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="secao" id="para-quem">
        <div className="secao-cabecalho revelar">
          <p className="sobretitulo">Para quem</p>
          <h2 className="titulo-secao">Feito para quem aluga e para quem avalia</h2>
        </div>
        <div className="publicos">
          {PUBLICOS.map(({ classe, icone: Icone, titulo, texto, itens }) => (
            <article className={`${classe} revelar`} key={titulo}>
              <div className="publico-topo">
                <span className="recurso-icone"><Icone aria-hidden="true" /></span>
                <div>
                  <h3>{titulo}</h3>
                  <p>{texto}</p>
                </div>
              </div>
              <ul>
                {itens.map((item) => <li key={item}><BadgeCheck aria-hidden="true" />{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="secao banner-secao">
        <div className="banner revelar">
          <div className="banner-carro" aria-hidden="true" />
          <div>
            <h2>Seu próximo carro está a um pedido de distância</h2>
            <p>Cadastre-se e envie seu primeiro pedido em poucos minutos.</p>
          </div>
          <div className="banner-acoes">
            <button className="botao-grande claro" onClick={() => onTrocarTela('cadastro')}>
              Começar agora
              <ArrowRight aria-hidden="true" />
            </button>
            <button className="botao-grande contorno-claro" onClick={() => onTrocarTela('login')}>Entrar</button>
          </div>
        </div>
      </section>

      <footer className="rodape-site">
        <div className="rodape-interno">
          <div className="rodape-marca">
            <span className="logo" aria-hidden="true" />
            <p>Sistema para gestão de aluguéis de automóveis: pedidos pela internet, analisados por empresas e bancos.</p>
          </div>
          <div>
            <h4>Navegação</h4>
            <ul>
              <li><a href="#recursos">Recursos</a></li>
              <li><a href="#como-funciona">Como funciona</a></li>
              <li><a href="#para-quem">Para quem</a></li>
            </ul>
          </div>
          <div>
            <h4>Acesso</h4>
            <ul>
              <li><button type="button" className="link-rodape" onClick={() => onTrocarTela('login')}>Entrar</button></li>
              <li><button type="button" className="link-rodape" onClick={() => onTrocarTela('cadastro')}>Criar conta</button></li>
            </ul>
          </div>
          <div>
            <h4>Projeto</h4>
            <ul>
              <li>Laboratório 02 · DIAW</li>
              <li>Engenharia de Software · PUC Minas</li>
            </ul>
          </div>
        </div>
        <p className="rodape-copy">© 2026 Locar · Projeto acadêmico</p>
      </footer>
    </main>
  )
}
