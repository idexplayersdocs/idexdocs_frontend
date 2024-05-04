import Image from "next/image";
import Loading from "react-loading";
type Props = {
  athleteData: any
}

export default function SideBar({athleteData}:any) {
  if (!athleteData) {
    return <div className="d-flex justify-content-center align-items-center w-100 h-25" ><Loading type='bars' color="var(--bg-ternary-color)"/></div>
  }
  
    return (
    <div className="container sidebar__background h-100 ms-2 rounded mb-5 overflow-auto">
      <Image
        className="rounded mt-3"
        src="/images/image-user.png"
        width={200}
        height={250}
        alt="Athlete logo"
        layout="responsive"
        objectFit="cover"
      />
      <div className="mt-2">
        <h1 className="title-sidebar">Nome:</h1>
        <h2 className="subtitle-sidebar">{athleteData.nome}</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Posição:</h1>
        <h2 className="subtitle-sidebar">{athleteData.posicao}</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Nascimento:</h1>
        <h2 className="subtitle-sidebar">{athleteData.data_nascimento ? new Date(athleteData.data_nascimento).toLocaleDateString() : 'Não cadastrada'}</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Clube:</h1>
        <h2 className="subtitle-sidebar">{athleteData.clube_atual ? athleteData.clube_atual : 'Não possui clube'}</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Contrato Clube:</h1>
        <h2 className="subtitle-sidebar">{athleteData.contrato.tipo ? athleteData.contrato.tipo : 'Não possui contrato'}</h2>
        <h2 className="subtitle-sidebar">{new Date(athleteData.contrato.data_inicio).toLocaleDateString()} - {new Date(athleteData.contrato.data_termino).toLocaleDateString()}</h2>
      </div>
      {/* <div className="mt-2">
        <h1 className="title-sidebar">Contrato:</h1>
        <h2 className="subtitle-sidebar">Profissional</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Período</h1>
        <h2 className="subtitle-sidebar">29/04/2023 - 29/04/2023</h2>
      </div> */}
      <div className="mt-2">
        <h1 className="title-sidebar">Contrato Empresa:</h1>
        <h2 className="subtitle-sidebar">Profissional</h2>
        <h2 className="subtitle-sidebar">29/04/2023 - 29/04/2023</h2>
      </div>
    </div>
  )
}