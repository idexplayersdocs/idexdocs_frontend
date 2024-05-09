
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Modal, Pagination, Typography } from '@mui/material';
import Subtitle from './Subtitle';
import data from '../pages/api/mock-data/mock-data-physical-characteristics.json'

import Observacoes from './Observation';
import { faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons';
import AddButton from './AddButton';
import { getAthletes } from '@/pages/api/http-service/athletes';
import HistoryCompetitions from './modal/HistoryCompetitions';
import ClubHistory from './modal/ClubHistory';
import Injuries from './modal/Injuries';
import PhysicalHistory from './modal/PhysicalHistory';
import { useRouter } from 'next/router';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
};

export default function Performance() {
  const effectRan = useRef(false);
  const { query, push, back } = useRouter();
  const athleteId = query?.id;
  console.log(athleteId)
  const [openHistoryCompetitions, setOpenHistoryCompetitions] = React.useState(false);
  const [openClubHistory, setOpenClubHistory] = React.useState(false);
  const [openInjuries, setOpenInjuries] = React.useState(false);
  const [openPhysicalHistory, setOpenPhysicalHistory] = React.useState(false);

  const handleOpenHistoryCompetitions = () => setOpenHistoryCompetitions(true);
  const handleCloseHistoryCompetitions = () => setOpenHistoryCompetitions(false);

  const handleOpenClubHistory = () => setOpenClubHistory(true);
  const handleCloseClubHistory = () => setOpenClubHistory(false);

  const handleOpenInjuries = () => setOpenInjuries(true);
  const handleCloseInjuries = () => setOpenInjuries(false);
  
  const handleOpenPhysicalHistory = () => setOpenPhysicalHistory(true);
  const handleClosePhysicalHistory = () => setOpenPhysicalHistory(false);

  return (
    <div className='pe-3'>
    <div className="container text-center mt-4">
      <div className="row">
        <div className="col">
          <button type="button" className="btn btn-modal-color w-75 mb-3" onClick={handleOpenHistoryCompetitions}>Histórico de competições</button>
          <br />
          <button type="button" className="btn btn-modal-color w-75" onClick={handleOpenClubHistory}>Histórico de Clubes</button>
        </div>
        <div className="col">
          <button type="button" className="btn btn-modal-color w-75 mb-3" onClick={handleOpenInjuries}>Histórico de Lesões</button>
          <br />
          <button type="button" className="btn btn-modal-color w-75 " onClick={handleOpenPhysicalHistory}>Histórico Físico</button>
        </div>
      </div>
    </div>
    <div className="col-6 d-flex flex-column align-items-center justify-content-center mb-3 ms-3 force-scrool mt-5" style={{width: 'auto'}}>
          <div className='d-flex justify-content-between w-100'>
            <Subtitle subtitle='Perfil Físico e Técnico' />
            <AddButton />
          </div>
          <table className="table table-striped mt-2 mb-3">
            <thead>
              <tr>
                <th className="table-dark text-center" scope="col"></th>
                <th className="table-dark text-center" scope="col">22/04/2024</th>
                <th className="table-dark text-center" scope="col">22/04/2024</th>
                <th className="table-dark text-center" scope="col">22/04/2024</th>
                <th className="table-dark text-center" scope="col">22/04/2024</th>
                <th className="table-dark text-center" scope="col">22/04/2024</th>
                <th className="table-dark text-center" scope="col">--</th>
              </tr>
            </thead>
              {
                data.map(characteristicPhysical => (
                  <tbody key={characteristicPhysical.Id}>
                    <tr>
                      <th className="table-dark table-header" scope="row">Perfil</th>
                      <td className="table-dark text-center table-body ">5</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Perfil.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Perfil.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Perfil.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Perfil.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Perfil.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Maturacao</th>
                      <td className="table-dark text-center table-body ">4</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Maturacao.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Maturacao.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Maturacao.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Maturacao.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Maturacao.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Agilidade / Impulsao</th>
                      <td className="table-dark text-center table-body ">3</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.AgilidadeImpulsao.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.AgilidadeImpulsao.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.AgilidadeImpulsao.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.AgilidadeImpulsao.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.AgilidadeImpulsao.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Velocidade Membros Superiores</th>
                      <td className="table-dark text-center table-body ">5</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.VelocidadeMembroSuperior.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.VelocidadeMembroSuperior.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.VelocidadeMembroSuperior.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.VelocidadeMembroSuperior.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.VelocidadeMembroSuperior.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Flexibilidade</th>
                      <td className="table-dark text-center table-body ">2</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Flexibilidade.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Flexibilidade.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Flexibilidade.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Flexibilidade.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Flexibilidade.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Posicionamento Ofensivo e Defensivo</th>
                      <td className="table-dark text-center table-body ">4</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.PsicionamentoOfensivoDefensivo.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.PsicionamentoOfensivoDefensivo.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.PsicionamentoOfensivoDefensivo.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.PsicionamentoOfensivoDefensivo.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.PsicionamentoOfensivoDefensivo.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Total:</th>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Total}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Total}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Total}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Total}</td>
                      <td className="table-dark text-center table-body ">100</td>
                      <td className="table-dark text-center table-body " >--</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Media:</th>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Media}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Media}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Media}</td>
                      <td className="table-dark text-center table-body ">{characteristicPhysical.CaracteristicaFisica.Media}</td>
                      <td className="table-dark text-center table-body ">100</td>
                      <td className="table-dark text-center table-body ">--</td>
                    </tr>
                </tbody>
                ))
              }
          </table>

          <Subtitle subtitle='Perfil Técnico Diferencial' />
          <table className="table table-striped mt-2">
            {/* <thead>
              <tr>
                <th className="table-dark text-center" scope="col"></th>
                <th className="table-dark text-center" scope="col">AVAL. INICIAL (dd/mm/yyy) </th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 6 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 12 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 18 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 24 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 30 MESES</th>
              </tr>
            </thead> */}
              {
                data.map(technicalcharacteristic => (
                  <tbody key={technicalcharacteristic.Id}>
                    <tr>
                      <th className="table-dark table-header" scope="row">Leitura de Jogo</th>
                      <td className="table-dark text-center table-body">5</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.LeituraJogo.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.LeituraJogo.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.LeituraJogo.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.LeituraJogo.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.LeituraJogo.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Jogo com os Pés/Reposição de Jogo</th>
                      <td className="table-dark text-center table-body ">5</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.JogosComPesReposicaoJogo.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.JogosComPesReposicaoJogo.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.JogosComPesReposicaoJogo.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.JogosComPesReposicaoJogo.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.JogosComPesReposicaoJogo.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Organização da Defesa/Domínio da Área</th>
                      <td className="table-dark text-center table-body ">5</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.OrganizacaoDefesaDominioArea.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.OrganizacaoDefesaDominioArea.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.OrganizacaoDefesaDominioArea.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.OrganizacaoDefesaDominioArea.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.OrganizacaoDefesaDominioArea.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Domínio Cobertura e Saída</th>
                      <td className="table-dark text-center table-body ">5</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.DominioCoberturaSaida.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.DominioCoberturaSaida.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.DominioCoberturaSaida.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.DominioCoberturaSaida.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.DominioCoberturaSaida.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Total:</th>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.Total}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.Total}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.Total}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.Total}</td>
                      <td className="table-dark text-center table-body ">100</td>
                      <td className="table-dark text-center table-body " >--</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row" >Media:</th>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.Media}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.Media}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.Media}</td>
                      <td className="table-dark text-center table-body ">{technicalcharacteristic.CaracteristicaTecnicas.Media}</td>
                      <td className="table-dark text-center table-body ">100</td>
                      <td className="table-dark text-center table-body " >--</td>
                    </tr>
                </tbody>
                ))
              }
          </table>
          
          <Subtitle subtitle='Perfil Psicológico' />
          <table className="table table-striped mt-2">
            {/* <thead>
              <tr>
                <th className="table-dark text-center" scope="col"></th>
                <th className="table-dark text-center" scope="col">AVAL. INICIAL (dd/mm/yyy) </th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 6 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 12 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 18 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 24 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 30 MESES</th>
              </tr>
            </thead> */}
              {
                data.map(psychologicalProfile => (
                  <tbody key={psychologicalProfile.Id}>
                    <tr>
                      <th className="table-dark table-header" scope="row" >Liderança</th>
                      <td className="table-dark text-center table-body ">5</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Lideranca.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Lideranca.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Lideranca.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Lideranca.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Lideranca.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Coragem/Confiança</th>
                      <td className="table-dark text-center">5</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.CoragemConfianca.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.CoragemConfianca.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.CoragemConfianca.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.CoragemConfianca.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.CoragemConfianca.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Concentração / Responsabilidade</th>
                      <td className="table-dark text-center table-body ">5</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.ConcentracaoResponsabilidade.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.ConcentracaoResponsabilidade.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.ConcentracaoResponsabilidade.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.ConcentracaoResponsabilidade.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.ConcentracaoResponsabilidade.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Controle do Estresse</th>
                      <td className="table-dark text-center table-body ">5</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.ControleEstresse.Apos6Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.ControleEstresse.Apos12Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.ControleEstresse.Apos18Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.ControleEstresse.Apos24Meses}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.ControleEstresse.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Total:</th>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Total}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Total}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Total}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Total}</td>
                      <td className="table-dark text-center table-body ">100</td>
                      <td className="table-dark text-center table-body " >--</td>
                    </tr>
                    <tr>
                      <th className="table-dark table-header" scope="row">Media:</th>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Media}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Media}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Media}</td>
                      <td className="table-dark text-center table-body ">{psychologicalProfile.PerfilPsicologico.Media}</td>
                      <td className="table-dark text-center table-body ">100</td>
                      <td className="table-dark text-center table-body " >--</td>
                    </tr>
                    {/* <tr>
                      <th className="table-dark" scope="row" style={{fontSize:'20px'}}>Avaliação Final (Média das Médias):</th>
                      <td className="table-dark text-center" style={{fontSize:'25px'}}>{psychologicalProfile.AvaliacaoFinalMedia}</td>
                    </tr> */}
                </tbody>
                ))
              }
          </table>
          
          <table className="table table-striped mt-4">
          {
                data.map(psychological => (
                  <tbody key={psychological.Id}>
                    <tr>
                      <th className="table-dark table-header" scope="row">Avaliação Final (Média das Médias):</th>
                      <td className="table-dark text-center table-body">5</td>
                      <td className="table-dark text-center table-body">100</td>
                      <td className="table-dark text-center table-body">100</td>
                      <td className="table-dark text-center table-body">100</td>
                      <td className="table-dark text-center table-body">100</td>
                      <td className="table-dark text-center table-body">100</td>
                    </tr>
                </tbody>
                ))
              }
          </table>
          
          {/* <div>
            <Subtitle subtitle='Avaliação Final (Média das Médias):'/>
            <Subtitle subtitle='100'/>
          </div> */}

          <div className='d-flex justify-content-end mb-3 mt-3' style={{width: '99%'}}>
            <div className='d-flex justify-content-center align-items-center' style={{backgroundColor: 'var(--bg-ternary-color)', borderRadius: '100px', width: '50px', height: '50px', cursor:'pointer'}}>
              <FontAwesomeIcon icon={faQuestion}  size='xl' color='white'/>
            </div>
          </div>
            <Observacoes />
          <div className='ms-3 d-flex flex-column' style={{width: '98%'}}>
            <button type="button" className="btn btn-success align-self-end" style={{width:'170px'}}>Salvar Observações</button>
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
              <HistoryCompetitions />
            </Box>
          </Modal>
          <Modal
            open={openClubHistory}
            onClose={handleCloseClubHistory}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <ClubHistory />
            </Box>
          </Modal>
          <Modal
            open={openInjuries}
            onClose={handleCloseInjuries}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Injuries />
            </Box>
          </Modal>
          <Modal
            open={openPhysicalHistory}
            onClose={handleClosePhysicalHistory}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <PhysicalHistory />
            </Box>
          </Modal>
    </div>
  )
}