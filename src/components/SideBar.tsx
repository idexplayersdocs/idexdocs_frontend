import Image from "next/image";

export default function SideBar() {
  return (
    <div className="container sidebar__background h-100 ms-2 rounded mb-5">
      <Image
        className="rounded mt-3"
        src="/images/image-user.png"
        width={200}
        height={250}
        alt="Athlete logo"
        layout="responsive"
        objectFit="cover" // ou "contain", dependendo do comportamento desejado
      />
      <div className="mt-2">
        <h1 className="title-sidebar">Nome:</h1>
        <h2 className="subtitle-sidebar">marcos vinicius oliveira da silva</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Posição:</h1>
        <h2 className="subtitle-sidebar">Goleiro</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Data de Nascimento:</h1>
        <h2 className="subtitle-sidebar">20/04/2000</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Clube Atual:</h1>
        <h2 className="subtitle-sidebar">Guaratingueta desde XX/XX</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Tipo de Contrato:</h1>
        <h2 className="subtitle-sidebar">Profissional</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Período</h1>
        <h2 className="subtitle-sidebar">DE DD/MM/YYYY até DD/MM/YYYY</h2>
      </div>

    </div>
  )
}