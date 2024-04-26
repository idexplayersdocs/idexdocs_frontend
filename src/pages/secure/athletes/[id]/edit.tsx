import { useRouter } from "next/router"

export default function AthleteEdit() {
  const { query, push, back } = useRouter();

  const athleteId = query?.id;

  return (
    <>
      <h1>Editar o atleta</h1>
      <h1>{ athleteId }</h1>
      <button onClick={()=> push(`/secure/athletes/${athleteId}/edit`)}>Editar</button>
      <button onClick={()=> back()}>Voltar</button>
    </>
  )
}