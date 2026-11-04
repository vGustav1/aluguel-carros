import { Briefcase, Building2, IdCard, KeyRound, Lock, MapPin, Plus, Save, Trash2, User, UserPlus, Wallet } from 'lucide-react'
import { useState } from 'react'
import Aviso from './Aviso'

const MAX_RENDIMENTOS = 3
const CAMPOS = ['nome', 'login', 'senha', 'rg', 'cpf', 'endereco', 'profissao']

function estadoInicial(inicial = {}) {
  const dados = { rendimentos: inicial.rendimentos ?? [] }
  CAMPOS.forEach((c) => { dados[c] = inicial[c] ?? '' })
  return dados
}

function Campo({ rotulo, icone: Icone, ...props }) {
  return (
    <label>
      {rotulo}
      <span className="campo-icone">
        <Icone aria-hidden="true" />
        <input {...props} />
      </span>
    </label>
  )
}

export default function FormCliente({ inicial, comAcesso, textoBotao, onEnviar }) {
  const [dados, setDados] = useState(() => estadoInicial(inicial))
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  const campo = (nome) => ({
    value: dados[nome],
    onChange: (e) => setDados({ ...dados, [nome]: e.target.value }),
  })

  function alterarRendimento(indice, nome, valor) {
    const rendimentos = dados.rendimentos.map((r, i) => (i === indice ? { ...r, [nome]: valor } : r))
    setDados({ ...dados, rendimentos })
  }

  function adicionarRendimento() {
    setDados({ ...dados, rendimentos: [...dados.rendimentos, { entidadeEmpregadora: '', valor: '' }] })
  }

  function removerRendimento(indice) {
    setDados({ ...dados, rendimentos: dados.rendimentos.filter((_, i) => i !== indice) })
  }

  async function enviar(evento) {
    evento.preventDefault()
    setErro('')
    setSucesso('')
    setEnviando(true)
    try {
      const rendimentos = dados.rendimentos.map((r) => ({ ...r, valor: Number(r.valor) }))
      setSucesso((await onEnviar({ ...dados, rendimentos })) ?? '')
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  const IconeBotao = comAcesso ? UserPlus : Save

  return (
    <form onSubmit={enviar}>
      {comAcesso && (
        <fieldset>
          <legend><KeyRound aria-hidden="true" />Acesso</legend>
          <div className="linha">
            <Campo rotulo="Login" icone={User} {...campo('login')} autoComplete="username" required />
            <Campo rotulo="Senha" icone={Lock} type="password" {...campo('senha')} autoComplete="new-password" required />
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend><IdCard aria-hidden="true" />Dados pessoais</legend>
        <Campo rotulo="Nome" icone={User} {...campo('nome')} required />
        <div className="linha">
          <Campo rotulo="RG" icone={IdCard} {...campo('rg')} required />
          <Campo rotulo="CPF" icone={IdCard} {...campo('cpf')} required />
        </div>
        <Campo rotulo="Endereço" icone={MapPin} {...campo('endereco')} required />
        <Campo rotulo="Profissão" icone={Briefcase} {...campo('profissao')} required />
      </fieldset>

      <fieldset>
        <legend><Wallet aria-hidden="true" />Rendimentos <span className="contagem">{dados.rendimentos.length} de {MAX_RENDIMENTOS}</span></legend>
        {dados.rendimentos.length === 0 && <p className="vazio">Nenhum rendimento informado.</p>}
        {dados.rendimentos.map((r, i) => (
          <div className="linha rendimento" key={i}>
            <Campo
              rotulo="Entidade empregadora" icone={Building2} value={r.entidadeEmpregadora}
              onChange={(e) => alterarRendimento(i, 'entidadeEmpregadora', e.target.value)} required
            />
            <Campo
              rotulo="Valor (R$)" icone={Wallet} type="number" min="0" step="0.01" value={r.valor}
              onChange={(e) => alterarRendimento(i, 'valor', e.target.value)} required
            />
            <button
              type="button" className="botao-icone perigo" onClick={() => removerRendimento(i)}
              aria-label={`Remover rendimento ${i + 1}`} title="Remover rendimento"
            >
              <Trash2 aria-hidden="true" />
            </button>
          </div>
        ))}
        {dados.rendimentos.length < MAX_RENDIMENTOS && (
          <button type="button" className="secundario tracejado" onClick={adicionarRendimento}>
            <Plus aria-hidden="true" />
            Adicionar rendimento
          </button>
        )}
      </fieldset>

      {erro && <Aviso>{erro}</Aviso>}
      {sucesso && <Aviso tipo="sucesso">{sucesso}</Aviso>}
      <button className="botao-grande" disabled={enviando}>
        <IconeBotao aria-hidden="true" />
        {enviando ? 'Salvando…' : textoBotao}
      </button>
    </form>
  )
}
