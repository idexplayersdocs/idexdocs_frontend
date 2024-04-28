import Subtitle from "./Subtitle";

export default function Observacoes() {
  return (
    <>
      <label style={{ width: '100%' }}>
        <Subtitle subtitle='Observações' />
        <textarea rows={6} style={{ width: '100%' }}/>
      </label>
    </>
  )
}