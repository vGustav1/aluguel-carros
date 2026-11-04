import { useState } from 'react'

const MAX_RENDIMENTOS = 3
const CAMPOS = ['nome', 'login', 'senha', 'rg', 'cpf', 'endereco', 'profissao']

// Troca null por '' para os inputs não reclamarem
function estadoInicial(inicial = {}) {
  const dados = { rendimentos: inicial.rendimentos ?? [] }
  CAMPOS.forEach((c) => { dados[c] = inicial[c] ?? '' })
  return dados
}

// Usado no cadastro e em "Meus dados"
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

  return (
    <form onSubmit={enviar}>
      <label>Nome<input {...campo('nome')} required /></label>
      {comAcesso && (
        <div className="linha">
          <label>Login<input {...campo('login')} autoComplete="username" required /></label>
          <label>Senha<input type="password" {...campo('senha')} autoComplete="new-password" required /></label>
        </div>
      )}
      <div className="linha">
        <label>RG<input {...campo('rg')} required /></label>
        <label>CPF<input {...campo('cpf')} required /></label>
      </div>
      <label>Endereço<input {...campo('endereco')} required /></label>
      <label>Profissão<input {...campo('profissao')} required /></label>

      <fieldset>
        <legend>Rendimentos (até {MAX_RENDIMENTOS})</legend>
        {dados.rendimentos.map((r, i) => (
          <div className="linha" key={i}>
            <label>
              Entidade empregadora
              <input value={r.entidadeEmpregadora} onChange={(e) => alterarRendimento(i, 'entidadeEmpregadora', e.target.value)} required />
            </label>
            <label>
              Valor (R$)
              <input type="number" min="0" step="0.01" value={r.valor} onChange={(e) => alterarRendimento(i, 'valor', e.target.value)} required />
            </label>
            <button type="button" className="secundario" onClick={() => removerRendimento(i)}>Remover</button>
          </div>
        ))}
        {dados.rendimentos.length < MAX_RENDIMENTOS && (
          <button type="button" className="secundario" onClick={adicionarRendimento}>+ Adicionar rendimento</button>
        )}
      </fieldset>

      {erro && <p className="erro" role="alert">{erro}</p>}
      {sucesso && <p className="sucesso" role="status">{sucesso}</p>}
      <button disabled={enviando}>{enviando ? 'Salvando…' : textoBotao}</button>
    </form>
  )
}