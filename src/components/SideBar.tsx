import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "react-loading";
import SoccerField from "./SoccerField";
import { getAthleteById, getAvatarAthletes } from "@/pages/api/http-service/athletes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTriangleExclamation, faX } from "@fortawesome/free-solid-svg-icons";
import { Box, Button, Modal, Pagination, colors, styled } from "@mui/material";
import Subtitle from "./Subtitle";
import EditAthlete from "./EditAthlete";


type Props = {
  athleteData: any
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  height: '95%',
  overflow: 'auto'
};

export default function SideBar({ athleteData, modal }: any) {
  const { query, push, back } = useRouter();
  const athleteId = query?.id;
  const [openEditAthlete, setOpenEditAthlete] = useState(false);
  const validLabelDate = (dataAvaliacao: string) => {
    const currentDate = moment().startOf('day');
    const nextEvaluationDate = moment(dataAvaliacao).startOf('day');
    // const nextEvaluationDate = moment('2024-05-06').startOf('day');
    // Comparação das datas
    return currentDate.isAfter(nextEvaluationDate);
  };
  const handleOpenEditAthlete = () => setOpenEditAthlete(true);
  const handleCloseEditAthlete = () => { setOpenEditAthlete(false) }

  const handleCloseEditAthleteUpdate = () => {
    setOpenEditAthlete(false)
    location.reload();
  }



  if (!athleteData) {
    return <div className="d-flex justify-content-center align-items-center w-100 h-25" ><Loading type='bars' color="var(--bg-ternary-color)" /></div>
  }

  return (
    <div className={modal ? '' : 'container sidebar__background h-100 ms-2 rounded mb-5 overflow-auto'}>
      <div className="container-avatar">
        <Image
          className="rounded mt-3"
          src={athleteData.blob_url ? athleteData.blob_url : '/images/image-user.png'}
          width={200}
          height={250}
          alt="Athlete logo"
          layout="responsive"
          objectFit="cover"
        />
        <div className="edit-icon" onClick={handleOpenEditAthlete}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
      </div>
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
      <h1 className="title-sidebar mt-3">Contratos:</h1>
      {
        Array.isArray(athleteData.contratos) && athleteData.contratos.length > 0 ? (
          athleteData.contratos.map((contrato: any, index: number) => (
            <div className="mt-2" key={index}>
              <h1 className="title-sidebar">{contrato.tipo}</h1>
              {/* <h2 className="subtitle-sidebar">{moment(contrato.data_inicio).format('DD/MM/YYYY')} - {moment(contrato.data_termino).format('DD/MM/YYYY')}</h2> */}
              <h2 className={`subtitle-sidebar " ${validLabelDate(contrato.data_expiracao) ? 'danger-date' : ''}`}>{moment(contrato.data_inicio).format('DD/MM/YYYY')} - {moment(contrato.data_termino).format('DD/MM/YYYY')}
                {
                  validLabelDate(contrato.data_expiracao) &&
                  <FontAwesomeIcon className='ms-2 mt-1' icon={faTriangleExclamation} style={{ color: "#ff0000", }} />
                }
              </h2>
            </div>
          ))
        ) : (
          <h2 className="subtitle-sidebar">Não possui</h2>
        )
      }
      <div className="mt-3">
        <SoccerField athleteData={athleteData} />
      </div>
      <Modal
        open={openEditAthlete}
        onClose={handleCloseEditAthlete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="d-flex justify-content-between">
            <Subtitle subtitle="Editar do atleta" />
            <FontAwesomeIcon icon={faX} style={{ color: "#ffffff", cursor: 'pointer' }} size="xl" onClick={handleCloseEditAthlete} />
          </div>
          <hr />
          {/* <SideBar athleteData={athlete} modal={true}/> */}
          <EditAthlete athleteData={athleteData} closeModal={handleCloseEditAthleteUpdate} />
        </Box>
      </Modal>
    </div>
  )
}