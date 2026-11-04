import { Ban, CircleCheck, CircleX, Clock } from 'lucide-react'
import { STATUS } from '../formato'

const ICONES = { EM_ANALISE: Clock, APROVADO: CircleCheck, REPROVADO: CircleX, CANCELADO: Ban }

export default function StatusPedido({ status }) {
  const Icone = ICONES[status] ?? Clock
  return (
    <span className={`status ${status}`}>
      <Icone aria-hidden="true" />
      {STATUS[status] ?? status}
    </span>
  )
}
