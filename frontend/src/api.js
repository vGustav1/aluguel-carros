export class ErroApi extends Error {
  constructor(status) {
    super(status === 0
      ? 'Sem conexão com o servidor.'
      : `Não foi possível concluir a operação (erro ${status}).`)
    this.status = status
  }
}

// O Spring envia o token CSRF no cookie XSRF-TOKEN e espera ele de volta no cabeçalho
function tokenCsrf() {
  const cookie = document.cookie.split('; ').find((c) => c.startsWith('XSRF-TOKEN='))
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : ''
}

async function requisicao(metodo, caminho, corpo) {
  const opcoes = { method: metodo, headers: {} }

  if (metodo !== 'GET') {
    // Após login/logout o token muda; um GET qualquer gera um novo
    if (!tokenCsrf()) await fetch('/api/usuarios/me').catch(() => {})
    opcoes.headers['X-XSRF-TOKEN'] = tokenCsrf()
  }

  if (corpo instanceof URLSearchParams) {
    opcoes.body = corpo
  } else if (corpo !== undefined) {
    opcoes.headers['Content-Type'] = 'application/json'
    opcoes.body = JSON.stringify(corpo)
  }

  let resposta
  try {
    resposta = await fetch(`/api${caminho}`, opcoes)
  } catch {
    throw new ErroApi(0)
  }
  if (!resposta.ok) throw new ErroApi(resposta.status)

  const texto = await resposta.text()
  return texto ? JSON.parse(texto) : null
}

export const api = {
  usuarioLogado: () => requisicao('GET', '/usuarios/me'),
  // O Spring Security espera o login como formulário
  login: (login, senha) =>
    requisicao('POST', '/login', new URLSearchParams({ username: login, password: senha })),
  logout: () => requisicao('POST', '/logout'),

  cadastrarCliente: (cliente) => requisicao('POST', '/clientes', cliente),
  atualizarCliente: (id, cliente) => requisicao('PUT', `/clientes/${id}`, cliente),
  excluirCliente: (id) => requisicao('DELETE', `/clientes/${id}`),

  listarAutomoveis: () => requisicao('GET', '/automoveis'),

  listarPedidos: () => requisicao('GET', '/pedidos'),
  criarPedido: (automovelId) => requisicao('POST', '/pedidos', { automovel: { id: automovelId } }),
  modificarPedido: (id, automovelId) =>
    requisicao('PUT', `/pedidos/${id}`, { automovel: { id: automovelId } }),
  cancelarPedido: (id) => requisicao('POST', `/pedidos/${id}/cancelar`),
  avaliarPedido: (id, aprovado) => requisicao('POST', `/pedidos/${id}/avaliar?aprovado=${aprovado}`),

  // proprietario: 'CLIENTE' ou 'AGENTE'
  executarContrato: (id, proprietario) =>
    requisicao('POST', `/pedidos/${id}/contrato?proprietario=${proprietario}`),
  concederCredito: (id, valor) => requisicao('POST', `/pedidos/${id}/contrato/credito`, { valor }),
}