
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Modal, Pagination, Typography } from '@mui/material';
import Subtitle from './Subtitle';
import data from '../pages/api/mock-data/mock-data-physical-characteristics.json'

import Observacoes from './Observation';
import { faPlus, faQuestion, faX } from '@fortawesome/free-solid-svg-icons';
import AddButton from './AddButton';
import { getAthletes } from '@/pages/api/http-service/athletes';
import HistoryCompetitions from './modal/HistoryCompetitions';
import ClubHistory from './modal/ClubHistory';
import Injuries from './modal/Injuries';
import PhysicalHistory from './modal/PhysicalHistory';
import { useRouter } from 'next/router';
import Characteristics from './characteristics/characteristics';
import { getPhysical } from '@/pages/api/http-service/physical';
import { getObservations, saveObservations } from '@/pages/api/http-service/observations';
import { Bounce, toast } from 'react-toastify';
import PerformanceCreation from './modal/PerformanceCreation';
import { overflow } from 'html2canvas/dist/types/css/property-descriptors/overflow';
import ContractHistory from './modal/ContractHistory';

const styleCaracteristic = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  height: '95%',
  overflow: 'auto',
  borderRadius: '20px',
};

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

const styleInfo = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  height: 'auto',
  maxHeight: '80%',
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  overflow: 'auto'
};

export default function Performance({athleteData}: any) {
  const effectRan = useRef(false);
  const { query, push, back } = useRouter();
  const athleteId = query?.id;
  
  const [openHistoryCompetitions, setOpenHistoryCompetitions] = React.useState(false);
  const [openClubHistory, setOpenClubHistory] = React.useState(false);
  const [openInjuries, setOpenInjuries] = React.useState(false);
  const [openContractHistory, setOpenContractHistory] = React.useState(false);
  const [openPhysicalHistory, setOpenPhysicalHistory] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [openPerformanceCreation, setOpenPerformanceCreation] = React.useState(false);

  const handleOpenHistoryCompetitions = () => setOpenHistoryCompetitions(true);
  const handleCloseHistoryCompetitions = () => setOpenHistoryCompetitions(false);

  const handleOpenClubHistory = () => setOpenClubHistory(true);
  const handleCloseClubHistory = () => setOpenClubHistory(false);

  const handleOpenInjuries = () => setOpenInjuries(true);
  const handleCloseInjuries = () => setOpenInjuries(false);

  const handleOpenContractHistory = () => setOpenContractHistory(true);
  const handleCloseContractHistory = () => setOpenContractHistory(false);

  const [observacao, setObservacao] = useState<string>('');

  
  const handleOpenPhysicalHistory = () => setOpenPhysicalHistory(true);
  const handleClosePhysicalHistory = () => setOpenPhysicalHistory(false);


  const handleOpenPerformanceCreation = () => setOpenPerformanceCreation(true);
  const handleClosePerformanceCreation = () => {
    setOpenPerformanceCreation(false)
    const fetchAthletesData = async () => {
      try {
        const characteristic = await getPhysical(athleteId, 1, athleteData.posicao_primaria);
        setDataCharacteristic(characteristic?.data);

      }  catch(error: any){
        toast.error(error.response.data.errors[0].message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          });
          console.error('Error:', error);
      }
    }
    fetchAthletesData()
  };

  const handleOpenInfo = () => setOpenInfo(true);
  const handleCloseInfo = () => setOpenInfo(false);
  const [dataCharacteristic, setDataCharacteristic] = useState<any>();
  const [labelCharacteristic, setLabelCharacteristic] = useState<any>(() => {
    if (athleteData && athleteData.posicao_primaria.toLowerCase() === 'atacante') {
      return {
        fisico: ['Data', 'Estatura / Maturação', 'Velocidade / Aceleração Curta Distância', '1 x 1 Ofensivo', 'Desmarques / Mobilidade', 'Controle de Bola', 'Cruzamento / Passes para Gol', 'Finalização', 'Total', 'Média'],
        tecnico: ['Data', 'Visão Espacial', 'Domínio Orientado / Ambidestria', 'Dribles em Diagonal (Direção à Baliza)', 'Leitura de Jogo', 'Reação Pós Perda', 'Total', 'Média'],
        psicologico: ['Data','Criatividade / Improvisação', 'Capacidade de Decisão / Confiança / Extroversão', 'Inteligência Tática / Intuição Antecipar Ações','Competitividade / Coragem / Concentração', 'Total', 'Média']
      };
    } 
    else if(athleteData && athleteData.posicao_primaria.toLowerCase() === 'lateral') {
      return {
        fisico: ['Data', 'Estatura / Maturação', 'Velocidade', 'Passe Curto', 'Passe Longo', 'Capacidade Aeróbica', 'Fechamento Defensivo / Contenção', 'Total', 'Média'],
        tecnico: ['Data', 'Leitura de Jogo / Amplitude Organizacional', 'Participação Ofensiva / Penetração / Mobilidade', 'Cruzamento / 1 x 1 Ofencivo', 'Jogo Aéreo', 'Condução de Bola em Velocidade', 'Total', 'Média'],
        psicologico: ['Data','Liderança / Comunicação Pró-Ativa', 'Confiança / Transm. Segurança / Responsabilidade', 'Inteligência Tática / Intuição Ent. Ação Advers.','Competitividade', 'Total', 'Média']
      };
    }
    else if(athleteData && athleteData.posicao_primaria.toLowerCase() === 'meia') {
      return {
        fisico: ['Data', 'Estatura / Maturação', 'Velocidade', 'Leitura de Jogo / Cobertura Ofensiva / Contenção', 'Desmarques / Mobilidade', 'Controle de Bola / Passe para Gol', 'Capacidade Aeróbica', 'Finalização', 'Total', 'Média'],
        tecnico: ['Data', 'Visão Espacial', 'Domíinio Orientado / Ambidestria', 'Dribles', 'Organização Ação Ofensiva / Dinâmica', 'Pisada na Área para Finalizar / Penetração', 'Total', 'Média'],
        psicologico: ['Data','Criatividade e Improvisação', 'Capacidade de Decisão', 'Confiança / Responsabilidade','Inteligência Tática / Intuição Antecipar Ações', 'Competitividade / Coragem / Concentração', 'Total', 'Média']
      };
    }
    else if(athleteData && athleteData.posicao_primaria.toLowerCase() === 'zagueiro') {
      return {
        fisico: ['Data', 'Estatura / Maturação', 'Força / Recuperação / Cobertura', 'Passe Curto', 'Passe Longo', 'Jogo Aéreo', 'Confronto Defensivo 1 x 1 / Contenção', 'Total', 'Média'],
        tecnico: ['Data', 'Leitura de Jogo / Organização Defensiva', 'Ambidestria', 'Participação Ofensiva / Penetração / Mobilidade', 'Cabeceio Ofensivo', 'Passe Entre Linhas / Passe Longo Diagonal', 'Total', 'Média'],
        psicologico: ['Data','Liderança / Comunicação Pró-Ativa', 'Confiança / Transm. Segurança / Responsabilidade','Inteligência Tática / Intuição Ent. Ação Advers.', 'Competitividade', 'Total', 'Média']
      };
    }
    else if(athleteData && athleteData.posicao_primaria.toLowerCase() === 'goleiro') {
      return {
        fisico: ['Data', 'Perfil', 'Maturação', 'Agilidade / Impulsão', 'Velocidade Membros Superiores', 'Flexibilidade', 'Posicionamento Ofensivo e Defensivo', 'Total', 'Média'],
        tecnico: ['Data', 'Leitura de Jogo', 'Jogo com os Pés / Reposição de Jogo', 'Organização da Defesa / Domínio da Área', 'Domínio Coberturas e Saídas', 'Total', 'Média'],
        psicologico: ['Data','Liderança', 'Coragem / Confiança', 'Concentração / Responsabilidade', 'Controle de Estresse', 'Total', 'Média']
      };
    }
    else if(athleteData && athleteData.posicao_primaria.toLowerCase() === 'volante') {
      return {
        fisico: ['Data', 'Estatura / Maturação', 'Força / Desarmes / Contenção', 'Passe Curto', 'Capacidade Aeróbica', 'Dinâmica / Mobilidade / Penetração', 'Visão Espacial / Mudança de Corredores', 'Total', 'Média'],
        tecnico: ['Data', 'Leitura de Jogo / Coberturas / Espaço', 'Domínio Orientado / Ambidestria', 'Jogo Aéreo Ofensivo / Defensivo', 'Passes Verticais', 'Finalização de Média Distância', 'Total', 'Média'],
        psicologico: ['Data','Liderança / Comunicação Pró-Ativa', 'Confiança / Transm. Segurança / Responsabilidade','Inteligência Tática / Intuição Ent. Ação Advers.', 'Competitividade / Coragem / Conventração', 'Total', 'Média']
      };
    }
  });

  useEffect(() => {
    const fetchAthletesData = async () => {
      try {
        const characteristic = await getPhysical(athleteId, 1, athleteData.posicao_primaria);
        setDataCharacteristic(characteristic?.data);

        // Observações
        const responseObservacoes = await getObservations(athleteId, 'desempenho');
        // let observacao = responseObservacoes?.data[responseObservacoes?.data.length - 1]
        if(responseObservacoes.data){
          setObservacao(responseObservacoes.data.descricao);
        }
      } catch (error) {
        console.error('Error', error);
      }
    };

    fetchAthletesData();
  }, [athleteId, athleteData]);

  const handleInputObservation = (event: any) => {
    setObservacao(event.target.value)
  };

  const handleSaveObservation = async () => {
    try {
      const request = {
        atleta_id: athleteId,
        tipo: "desempenho",
        descricao: observacao
      }
      const response = await saveObservations(request);
    } catch (error:any) {
      toast.error(error.response.data.errors[0].message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
      console.error('Error:', error);
    } finally{
    }
  };


  return (
    <div className=''>
    <div className="container text-center mt-4">
      <div className="row">
        <div className="col-lg-6 pe-4">
          <button type="button" className="btn btn-modal-color w-75 mb-3 w-100" onClick={handleOpenHistoryCompetitions}>Histórico de competições</button>
          <br />
          <button type="button" className="btn btn-modal-color w-75 mb-3 w-100" onClick={handleOpenClubHistory}>Histórico de Clubes</button>
          <br />
          {/* <button type="button" className="btn btn-modal-color w-75 w-100" onClick={handleOpenContractHistory}>Histórico de Contratos</button> */}
        </div>
        <div className="col-lg-6 pe-4">
          <button type="button" className="btn btn-modal-color w-75 mb-3 w-100" onClick={handleOpenInjuries}>Histórico de Lesões</button>
          <br />
          <button type="button" className="btn btn-modal-color w-75 w-100" onClick={handleOpenPhysicalHistory}>Histórico Físico</button>
        </div>
      </div>
    </div>
    <div className="col-6 d-flex flex-column align-items-center justify-content-center mb-3 ms-2 mt-5 table-performance-responsive">
          <div className='d-flex justify-content-between w-100' style={{marginBottom: '-5px'}}>
            <div className='align-self-end'>
            <Subtitle subtitle='Perfil Físico e Técnico' />
            </div>
            <div onClick={handleOpenPerformanceCreation}>
              <AddButton />
            </div>
          </div>
          <Characteristics dataList={dataCharacteristic} labelList={labelCharacteristic}/>
          <div className='d-flex justify-content-end mb-3 mt-3' style={{width: '99%'}}>
            <div className='d-flex justify-content-center align-items-center' style={{backgroundColor: 'var(--bg-ternary-color)', borderRadius: '100px', width: '50px', height: '50px', cursor:'pointer'}} onClick={handleOpenInfo}>
              <FontAwesomeIcon icon={faQuestion}  size='xl' color='white'/>
            </div>
          </div>
              <div className='ms-3 d-flex flex-column observacao-performace' style={{width: '98%'}}>
                <label style={{ width: '100%' }}>
                  <Subtitle subtitle='Observações' />
                  <textarea onChange={handleInputObservation} value={observacao} rows={6} style={{ width: '100%' }}/>
                </label>
                <button type="button" className="btn btn-success align-self-end" style={{ width: '170px' }} onClick={handleSaveObservation}>Salvar Observações</button>
              </div>
        </div>
          {/* modal */}
          <Modal
            open={openHistoryCompetitions}
            onClose={handleCloseHistoryCompetitions}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <HistoryCompetitions closeModal={handleCloseHistoryCompetitions} athleteId={athleteId}/>
            </Box>
          </Modal>
          <Modal
            open={openClubHistory}
            onClose={handleCloseClubHistory}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <ClubHistory closeModal={handleCloseClubHistory} athleteId={athleteId}/>
            </Box>
          </Modal>
          <Modal
            open={openInjuries}
            onClose={handleCloseInjuries}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Injuries closeModal={handleCloseInjuries} athleteId={athleteId}/>
            </Box>
          </Modal>
          <Modal
            open={openPhysicalHistory}
            onClose={handleClosePhysicalHistory}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <PhysicalHistory closeModal={handleClosePhysicalHistory} athleteId={athleteId}/>
            </Box>
          </Modal>
          <Modal
            keepMounted 
            open={openInfo}
            onClose={handleCloseInfo}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleInfo}>
              <div className='d-flex justify-content-between'>
                <Subtitle subtitle='AÇÕES PARA AVALIAÇÃO FINAL RELATIVA AOS DADOS DE PROJEÇÃO:'/>
                <FontAwesomeIcon icon={faX} color='white' size='xl' style={{cursor: 'pointer'}} onClick={handleCloseInfo}/>
              </div>
              <hr />
              <div>
                <h2 style={{color: 'white', fontSize: '18px'}}>AF &gt; 1 é relativo a atletas com baixa perspectiva futura (à liberar)</h2>
                <h2 style={{color: 'white', fontSize: '18px'}}>AF &gt; 2 é relativo a atletas com média perspectiva futura (à avaliar em curto prazo).</h2>
                <h2 style={{color: 'white', fontSize: '18px'}}>AF &gt; 3 é relativo a atletas com boa perspectiva futura (à avaliar em médio prazo)</h2>
                <h2 style={{color: 'white', fontSize: '18px'}}>AF &gt; 4 é relativo a atletas com perspectiva de atleta profissional</h2>
              </div>
            </Box>
          </Modal>
          <Modal
            open={openPerformanceCreation}
            onClose={handleClosePerformanceCreation}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleCaracteristic}>
              <PerformanceCreation closeModal={handleClosePerformanceCreation} athleteData={athleteData} dataList={dataCharacteristic} labelList={labelCharacteristic} athleteId={athleteId}/>
            </Box>
          </Modal>
          <Modal
            open={openContractHistory}
            onClose={handleCloseContractHistory}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <ContractHistory closeModal={handleCloseContractHistory} athleteId={athleteId}/>
            </Box>
          </Modal>
    </div>
  )
}