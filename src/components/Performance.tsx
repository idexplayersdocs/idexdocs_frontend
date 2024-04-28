
import React, { useState } from 'react';
import dataSupportControl from '../pages/api/mock-data/mock-data-support-control.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pagination } from '@mui/material';
import Subtitle from './Subtitle';
import data from '../pages/api/mock-data/mock-data-physical-characteristics.json'

import Observacoes from './observacoes';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

export default function Performance() {


  return (
    <div className='pe-3'>
    <div className="container text-center mt-4">
      <div className="row">
        <div className="col">
          <button type="button" className="btn btn-modal-color w-75 mb-3">Histórico de competições</button>
          <br />
          <button type="button" className="btn btn-modal-color w-75">Histórico de Clubes</button>
        </div>
        <div className="col">
          <button type="button" className="btn btn-modal-color w-75 mb-3">Histórico de Lesões</button>
          <br />
          <button type="button" className="btn btn-modal-color w-75 ">Estatura - Envergadura - Peso - % Gordura</button>
        </div>
      </div>
    </div>
    <div className="col-6 d-flex flex-column align-items-center justify-content-center mb-3 ms-3 force-scrool mt-5">
          <Subtitle subtitle='Caracteristicas Físicas e Técnicas (Goleiros)' />
          <table className="table table-striped mt-3" style={{marginBottom:'60px'}}>
            <thead>
              <tr>
                <th className="table-dark text-center" scope="col"></th>
                <th className="table-dark text-center" scope="col">AVAL. INICIAL (dd/mm/yyy) </th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 6 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 12 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 18 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 24 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 30 MESES</th>
              </tr>
            </thead>
              {
                data.map(characteristicPhysical => (
                  <tbody key={characteristicPhysical.Id}>
                    <tr>
                      <th className="table-dark" scope="row">Perfil</th>
                      <td className="table-dark text-center">{new Date(characteristicPhysical.CaracteristicaFisica.Perfil.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Perfil.Apos6Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Perfil.Apos12Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Perfil.Apos18Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Perfil.Apos24Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Perfil.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Maturacao</th>
                      <td className="table-dark text-center">{new Date(characteristicPhysical.CaracteristicaFisica.Maturacao.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Maturacao.Apos6Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Maturacao.Apos12Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Maturacao.Apos18Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Maturacao.Apos24Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Maturacao.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Agilidade / Impulsao</th>
                      <td className="table-dark text-center">{new Date(characteristicPhysical.CaracteristicaFisica.AgilidadeImpulsao.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.AgilidadeImpulsao.Apos6Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.AgilidadeImpulsao.Apos12Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.AgilidadeImpulsao.Apos18Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.AgilidadeImpulsao.Apos24Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.AgilidadeImpulsao.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Velocidade Membros Superiores</th>
                      <td className="table-dark text-center">{new Date(characteristicPhysical.CaracteristicaFisica.VelocidadeMembroSuperior.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.VelocidadeMembroSuperior.Apos6Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.VelocidadeMembroSuperior.Apos12Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.VelocidadeMembroSuperior.Apos18Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.VelocidadeMembroSuperior.Apos24Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.VelocidadeMembroSuperior.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Flexibilidade</th>
                      <td className="table-dark text-center">{new Date(characteristicPhysical.CaracteristicaFisica.Flexibilidade.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Flexibilidade.Apos6Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Flexibilidade.Apos12Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Flexibilidade.Apos18Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Flexibilidade.Apos24Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.Flexibilidade.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Psicionamento Ofensivo e Defensivo</th>
                      <td className="table-dark text-center">{new Date(characteristicPhysical.CaracteristicaFisica.PsicionamentoOfensivoDefensivo.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.PsicionamentoOfensivoDefensivo.Apos6Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.PsicionamentoOfensivoDefensivo.Apos12Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.PsicionamentoOfensivoDefensivo.Apos18Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.PsicionamentoOfensivoDefensivo.Apos24Meses}</td>
                      <td className="table-dark text-center">{characteristicPhysical.CaracteristicaFisica.PsicionamentoOfensivoDefensivo.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row" style={{fontSize:'25px'}}>Total:</th>
                      <td className="table-dark text-center" style={{fontSize:'25px'}}>{characteristicPhysical.CaracteristicaFisica.Total}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row" style={{fontSize:'25px'}}>Media:</th>
                      <td className="table-dark text-center" style={{fontSize:'25px'}}>{characteristicPhysical.CaracteristicaFisica.Media}</td>
                    </tr>
                </tbody>
                ))
              }
          </table>

          <Subtitle subtitle='Caracteristicas Técnicas Diferenciais (Goleiros)' />
          <table className="table table-striped mt-3"style={{marginBottom:'60px'}}>
            <thead>
              <tr>
                <th className="table-dark text-center" scope="col"></th>
                <th className="table-dark text-center" scope="col">AVAL. INICIAL (dd/mm/yyy) </th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 6 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 12 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 18 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 24 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 30 MESES</th>
              </tr>
            </thead>
              {
                data.map(technicalcharacteristic => (
                  <tbody key={technicalcharacteristic.Id}>
                    <tr>
                      <th className="table-dark" scope="row">Leitura de Jogo</th>
                      <td className="table-dark text-center">{new Date(technicalcharacteristic.CaracteristicaTecnicas.LeituraJogo.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.LeituraJogo.Apos6Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.LeituraJogo.Apos12Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.LeituraJogo.Apos18Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.LeituraJogo.Apos24Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.LeituraJogo.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Jogo com os Pés/Reposição de Jogo</th>
                      <td className="table-dark text-center">{new Date(technicalcharacteristic.CaracteristicaTecnicas.JogosComPesReposicaoJogo.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.JogosComPesReposicaoJogo.Apos6Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.JogosComPesReposicaoJogo.Apos12Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.JogosComPesReposicaoJogo.Apos18Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.JogosComPesReposicaoJogo.Apos24Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.JogosComPesReposicaoJogo.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Organização da Defesa/Domínio da Área</th>
                      <td className="table-dark text-center">{new Date(technicalcharacteristic.CaracteristicaTecnicas.OrganizacaoDefesaDominioArea.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.OrganizacaoDefesaDominioArea.Apos6Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.OrganizacaoDefesaDominioArea.Apos12Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.OrganizacaoDefesaDominioArea.Apos18Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.OrganizacaoDefesaDominioArea.Apos24Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.OrganizacaoDefesaDominioArea.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Domínio Cobertura e Saída</th>
                      <td className="table-dark text-center">{new Date(technicalcharacteristic.CaracteristicaTecnicas.DominioCoberturaSaida.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.DominioCoberturaSaida.Apos6Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.DominioCoberturaSaida.Apos12Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.DominioCoberturaSaida.Apos18Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.DominioCoberturaSaida.Apos24Meses}</td>
                      <td className="table-dark text-center">{technicalcharacteristic.CaracteristicaTecnicas.DominioCoberturaSaida.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row" style={{fontSize:'25px'}}>Total:</th>
                      <td className="table-dark text-center" style={{fontSize:'25px'}}>{technicalcharacteristic.CaracteristicaTecnicas.Total}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row" style={{fontSize:'25px'}}>Media:</th>
                      <td className="table-dark text-center" style={{fontSize:'25px'}}>{technicalcharacteristic.CaracteristicaTecnicas.Media}</td>
                    </tr>
                </tbody>
                ))
              }
          </table>
          
          <Subtitle subtitle='Perfil Psicológico (Goleiro)' />
          <table className="table table-striped mt-3" style={{marginBottom:'60px'}}>
            <thead>
              <tr>
                <th className="table-dark text-center" scope="col"></th>
                <th className="table-dark text-center" scope="col">AVAL. INICIAL (dd/mm/yyy) </th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 6 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 12 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 18 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 24 MESES</th>
                <th className="table-dark text-center" scope="col">PROJ. APÓS 30 MESES</th>
              </tr>
            </thead>
              {
                data.map(psychologicalProfile => (
                  <tbody key={psychologicalProfile.Id}>
                    <tr>
                      <th className="table-dark" scope="row">Liderança</th>
                      <td className="table-dark text-center">{new Date(psychologicalProfile.PerfilPsicologico.Lideranca.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.Lideranca.Apos6Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.Lideranca.Apos12Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.Lideranca.Apos18Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.Lideranca.Apos24Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.Lideranca.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Coragem/Confiança</th>
                      <td className="table-dark text-center">{new Date(psychologicalProfile.PerfilPsicologico.CoragemConfianca.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.CoragemConfianca.Apos6Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.CoragemConfianca.Apos12Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.CoragemConfianca.Apos18Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.CoragemConfianca.Apos24Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.CoragemConfianca.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Concentração / Responsabilidade</th>
                      <td className="table-dark text-center">{new Date(psychologicalProfile.PerfilPsicologico.ConcentracaoResponsabilidade.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.ConcentracaoResponsabilidade.Apos6Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.ConcentracaoResponsabilidade.Apos12Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.ConcentracaoResponsabilidade.Apos18Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.ConcentracaoResponsabilidade.Apos24Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.ConcentracaoResponsabilidade.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row">Controle do Estresse</th>
                      <td className="table-dark text-center">{new Date(psychologicalProfile.PerfilPsicologico.ControleEstresse.AvaliacaoInicial).toLocaleDateString()}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.ControleEstresse.Apos6Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.ControleEstresse.Apos12Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.ControleEstresse.Apos18Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.ControleEstresse.Apos24Meses}</td>
                      <td className="table-dark text-center">{psychologicalProfile.PerfilPsicologico.ControleEstresse.Apos30Meses}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row" style={{fontSize:'25px'}}>Total:</th>
                      <td className="table-dark text-center" style={{fontSize:'25px'}}>{psychologicalProfile.PerfilPsicologico.Total}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row" style={{fontSize:'25px'}}>Media:</th>
                      <td className="table-dark text-center" style={{fontSize:'25px'}}>{psychologicalProfile.PerfilPsicologico.Media}</td>
                    </tr>
                    <tr>
                      <th className="table-dark" scope="row" style={{fontSize:'20px'}}>Avaliação Final (Média das Médias):</th>
                      <td className="table-dark text-center" style={{fontSize:'25px'}}>{psychologicalProfile.AvaliacaoFinalMedia}</td>
                    </tr>
                </tbody>
                ))
              }
          </table>
          <div className='d-flex flex-row-reverse' style={{width: '95%', }}>
            <div className='d-flex justify-content-center align-items-center' style={{backgroundColor: 'rgb(0, 195, 255)', borderRadius: '100px', width: '50px', height: '50px', cursor:'pointer'}}>
              <FontAwesomeIcon icon={faQuestion}  size='xl' color='white'/>
            </div>
          </div>
          <div className='w-100'>
              <Observacoes />
          </div>
        </div>
    </div>
  )
}