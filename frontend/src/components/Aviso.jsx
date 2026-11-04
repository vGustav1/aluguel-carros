import { CircleAlert, CircleCheck } from 'lucide-react'

export default function Aviso({ tipo = 'erro', children }) {
  const Icone = tipo === 'sucesso' ? CircleCheck : CircleAlert
  return (
    <p className={`aviso ${tipo}`} role={tipo === 'sucesso' ? 'status' : 'alert'}>
      <Icone aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}
