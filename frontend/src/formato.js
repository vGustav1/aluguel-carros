export const STATUS = {
  EM_ANALISE: 'Em análise',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  CANCELADO: 'Cancelado',
}

export const descricaoAutomovel = (a) => `${a.marca} ${a.modelo} ${a.ano} · ${a.placa}`

export const moeda = (valor) =>
  Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const rendaTotal = (cliente) =>
  cliente.rendimentos.reduce((soma, r) => soma + Number(r.valor), 0)