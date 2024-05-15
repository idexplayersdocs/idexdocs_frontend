import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "react-loading";
import SoccerField from "./SoccerField";
import { getAvatarAthletes } from "@/pages/api/http-service/athletes";
type Props = {
  athleteData: any
}

export default function SideBar({athleteData}:any) {
  const [formAvatar, setFormAvatar]:any = useState<any>();
  const { query, push, back } = useRouter();
  const athleteId = query?.id;
  useEffect(()=> {
    const verificarImagem = async () => {
      // Se encontrar
      try{
        const response = await getAvatarAthletes(athleteId);
        console.log(response.blob_url)
        if(response.blob_url){
          setFormAvatar(response.blob_url);
        }
         else {
          setFormAvatar('/images/image-user.png');
        }
        // setFormAvatar(`https://idexdocsblob.blob.core.windows.net/atleta-perfil/atleta_${athleteId}.jpeg`);
      }
      // Se não encontrar
      catch(error){
        setFormAvatar('/images/image-user.png');
  
      }
    }
    verificarImagem();
  },[athleteId])

  if (!athleteData) {
    return <div className="d-flex justify-content-center align-items-center w-100 h-25" ><Loading type='bars' color="var(--bg-ternary-color)"/></div>
  }
  
    return (
    <div className="container sidebar__background h-100 ms-2 rounded mb-5 overflow-auto">
      <Image
        className="rounded mt-3"
        src={formAvatar}
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
        <h2 className="subtitle-sidebar">{athleteData.posicao_primaria ? athleteData.posicao_primaria : 'Não possui'}</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Posição Secundaria:</h1>
        <h2 className="subtitle-sidebar">{athleteData.posicao_secundaria ? athleteData.posicao_secundaria : 'Não possui'}</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Outra Posição:</h1>
        <h2 className="subtitle-sidebar">{athleteData.posicao_terciaria ? athleteData.posicao_terciaria : 'Não possui'}</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Nascimento:</h1>
        <h2 className="subtitle-sidebar">{athleteData.data_nascimento ? moment(athleteData.data_nascimento).format('DD/MM/YYYY') : 'Não cadastrada'}</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Clube:</h1>
        <h2 className="subtitle-sidebar">{athleteData.clube_atual ? athleteData.clube_atual : 'Não possui'}</h2>
      </div>
      <div className="mt-2">
        <h1 className="title-sidebar">Contrato Clube:</h1>
        <h2 className="subtitle-sidebar">{athleteData.contrato.tipo ? athleteData.contrato.tipo : 'Não possui'}</h2>
        <h2 className="subtitle-sidebar">{moment(athleteData.contrato.data_inicio).format('DD/MM/YYYY')} - {moment(athleteData.contrato.data_termino).format('DD/MM/YYYY')}</h2>
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
      <div className="mt-3">
        <SoccerField athleteData={athleteData}/>
      </div>
    </div>
  )
}