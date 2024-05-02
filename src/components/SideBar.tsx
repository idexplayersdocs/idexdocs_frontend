import Image from "next/image";
type Props = {
  athleteData: any
}

export default function SideBar({athleteData}:any) {
  if (!athleteData) {
    return <div>Loading...</div>; // ou outra lógica de carregamento
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
        <h2 className="subtitle-sidebar">{new Date(athleteData.data_nascimento).toLocaleDateString()}</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Clube:</h1>
        <h2 className="subtitle-sidebar">Guaratingueta desde XX/XX</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Contrato Clube:</h1>
        <h2 className="subtitle-sidebar">Profissional</h2>
        <h2 className="subtitle-sidebar">29/04/2023 - 29/04/2023</h2>
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