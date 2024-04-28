
import React, { useState } from 'react';
import dataRalationship from '../pages/api/mock-data/mock-data-relationship-list.json'
import dataSupportControl from '../pages/api/mock-data/mock-data-support-control.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Pagination } from '@mui/material';
import Subtitle from './Subtitle';
import Observacoes from './observacoes';

export default function Relationship() {
  const [pageRalationship, setPageRalationship] = useState(1);
  const [pageSupportControl, setPageSupportControl] = useState(1);

  // Ralationship
  const itemsPerPageRalationship = 7; 
  const startIndexRalationship = (pageRalationship - 1) * itemsPerPageRalationship;
  const endIndexRalationship = startIndexRalationship + itemsPerPageRalationship;
  const displayedDataRelationShip = dataRalationship.slice(startIndexRalationship, endIndexRalationship);
  
  const handleChangePageRalationship = (event: any, newPage:number) => {
    setPageRalationship(newPage);
  };
  

  // Support Control
  const itemsPerPageSupportControl = 3; 
  const startIndexSupportControl = (pageSupportControl - 1) * itemsPerPageSupportControl;
  const endIndexSupportControl = startIndexSupportControl + itemsPerPageSupportControl;
  const displayedSupportControl = dataSupportControl.slice(startIndexSupportControl, endIndexSupportControl);

  const handleChangePageSupportControl= (event: any, newPage:number) => {
    setPageSupportControl(newPage);
  };
  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center mb-3 m-3 force-scrool">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark text-center" scope="col">DATA</th>
              <th className="table-dark text-center" scope="col">RECEPTIVIDADE GERAL AO CONTATO</th>
              <th className="table-dark text-center" scope="col">NÍVEL DE SATISFAÇÃO COM A EMPRESA</th>
              <th className="table-dark text-center" scope="col">NÍVEL DE SATISFAÇÃO COM O CLUBE</th>
              <th className="table-dark text-center" scope="col">AVALIAÇÃO DE RELAÇÕES FAMILIARES</th>
              <th className="table-dark text-center" scope="col">AVALIAÇÃO DE INFLUÊNCIA EXTERNAS</th>
              <th className="table-dark text-center" scope="col">PENDÊNCIAS ENTRE ATLETAS E EMPRESA</th>
              <th className="table-dark text-center" scope="col">PENDÊNCIAS ENTRE ATLETAS E CLUBE</th>
            </tr>
          </thead>
          <tbody>
            {
              displayedDataRelationShip.map(relationship => (
                <tr key={relationship.Id}>
                  <td className="table-dark text-center">{new Date(relationship.Date).toLocaleDateString()}</td>
                  <td className="table-dark text-center">{relationship.ReceptividadeGeralContato}</td>
                  <td className="table-dark text-center">{relationship.NivelSatisfacaoEmpresa}</td>
                  <td className="table-dark text-center">{relationship.NivelSatisfacaoClube}</td>
                  <td className="table-dark text-center">{relationship.AvaliacaoRelacoesFamiliares}</td>
                  <td className="table-dark text-center">{relationship.AvaliacaoinfluenciaExternas}</td>

                  <td className="table-dark text-center">
                  <FontAwesomeIcon icon={relationship.PendenciaAtletaEmpresa ? faCheck : faXmark} size='2xl' style={ relationship.PendenciaAtletaEmpresa ? {color: "#15ff00"} : {color: "#ff0000"}}/>
                  </td>

                  <td className="table-dark text-center">
                  <FontAwesomeIcon icon={relationship.PendenciaEmpresaAtleta ? faCheck : faXmark} size='2xl' style={ relationship.PendenciaEmpresaAtleta ? {color: "#15ff00"} : {color: "#ff0000"}}/>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {
          dataRalationship.length > itemsPerPageRalationship &&
            <Pagination 
              className="pagination-bar"
              count={Math.ceil(dataRalationship.length / itemsPerPageRalationship)}
              page={pageRalationship}
              onChange={handleChangePageRalationship}
              variant="outlined"
              size="large"
            />
        }
      </div>
      <hr />
      <div className='row mt-3'>
        {/* <div className='col-6'>teste</div> */}
        <div className="col-6 d-flex flex-column align-items-center justify-content-center mb-3 ms-3 force-scrool">
          <Subtitle subtitle='Controle de Suporte' />
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-dark text-center" scope="col">CHUTEIRAS</th>
                <th className="table-dark text-center" scope="col">LUVAS</th>
                <th className="table-dark text-center" scope="col">PASSAGENS</th>
                <th className="table-dark text-center" scope="col">BONUS</th>
                <th className="table-dark text-center" scope="col">OUTROS</th>
              </tr>
            </thead>
            <tbody>
              {
                displayedSupportControl.map(supportContol => (
                  <tr key={supportContol.Id}>
                    <td className="table-dark text-center">{new Date(supportContol.FootballBoots).toLocaleDateString()}</td>
                    <td className="table-dark text-center">{new Date(supportContol.Gloves).toLocaleDateString()}</td>
                    <td className="table-dark text-center">{new Date(supportContol.Tickets).toLocaleDateString()}</td>
                    <td className="table-dark text-center">{new Date(supportContol.Bonus).toLocaleDateString()}</td>
                    <td className="table-dark text-center">{new Date(supportContol.Others).toLocaleDateString()}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {
          dataSupportControl.length > itemsPerPageSupportControl &&
            <Pagination 
              className="pagination-bar"
              count={Math.ceil(dataSupportControl.length / itemsPerPageSupportControl)}
              page={pageSupportControl}
              onChange={handleChangePageSupportControl}
              variant="outlined"
              size="large"
            />
        }
        </div>
        <div className='col-6'>
          <div className='ms-3'>
            <Observacoes />
          </div>
        </div>
      </div>
    </>
  )
}