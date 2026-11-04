import { data, moeda } from '../formato'

// Resumo do contrato de um pedido CONTRATADO
export default function ResumoContrato({ contrato }) {
  const credito = contrato.contratoCredito
  return (
    <span className="detalhe">
      Contrato de {data(contrato.dataAssinatura)} · carro em nome de {contrato.proprietario.nome}
      {credito && <> · crédito de {moeda(credito.valor)} ({credito.banco.nome})</>}
    </span>
  )
}