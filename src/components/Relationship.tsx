
import React, { useState } from 'react';
import dataRalationship from '../pages/api/mock-data/mock-data-relationship-list.json'
import dataSupportControl from '../pages/api/mock-data/mock-data-support-control.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Pagination } from '@mui/material';
import Subtitle from './Subtitle';
import Observacoes from './Observation';
import AddButton from './AddButton';

type Props = {
  athleteData: any
}
export default function Relationship({athleteData}: Props) {
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
  console.log(athleteData)
  return (
    <>
      <div className='text-end mt-3' style={{marginRight:'30px'}}>
        <AddButton />
      </div>
      <div className="d-flex flex-column align-items-center justify-content-center mb-3 m-3 force-scrool">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark text-center" style={{fontSize:'13px'}} scope="col">DATA</th>
              <th className="table-dark text-center" style={{fontSize:'13px'}} scope="col">RECEPTIVIDADE CONTATO</th>
              <th className="table-dark text-center" style={{fontSize:'13px'}} scope="col">SATISFAÇÃO EMPRESA</th>
              <th className="table-dark text-center" style={{fontSize:'13px'}} scope="col">SATISFAÇÃO CLUBE</th>
              <th className="table-dark text-center" style={{fontSize:'13px'}} scope="col">RELAÇÕES FAMILIARES</th>
              <th className="table-dark text-center" style={{fontSize:'13px'}} scope="col">INFLUÊNCIA EXTERNAS</th>
              <th className="table-dark text-center" style={{fontSize:'13px'}} scope="col">PENDÊNCIAS EMPRESA</th>
              <th className="table-dark text-center" style={{fontSize:'13px'}} scope="col">PENDÊNCIAS CLUBE</th>
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
                  <FontAwesomeIcon icon={relationship.PendenciaAtletaEmpresa ? faCheck : faXmark} size='xl' style={ relationship.PendenciaAtletaEmpresa ? {color: "#15ff00"} : {color: "#ff0000"}}/>
                  </td>

                  <td className="table-dark text-center">
                  <FontAwesomeIcon icon={relationship.PendenciaEmpresaAtleta ? faCheck : faXmark} size='xl' style={ relationship.PendenciaEmpresaAtleta ? {color: "#15ff00"} : {color: "#ff0000"}}/>
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
        <div className="col-md d-flex flex-column align-items-center justify-content-center mb-3 ms-3 force-scrool">
          <div className='d-flex justify-content-between align-items-center w-100 p-2'>
            <div>
            <Subtitle subtitle='Controle de Suporte' />
            </div>
            <AddButton />
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-dark text-center" scope="col">DATA</th>
                <th className="table-dark text-center" scope="col">NOME</th>
                <th className="table-dark text-center" scope="col">QUANTIDADE</th>
                {/* <th className="table-dark text-center" scope="col">BONUS</th>
                <th className="table-dark text-center" scope="col">OUTROS</th> */}
              </tr>
            </thead>
            <tbody>
              {
                displayedSupportControl.map(supportContol => (
                  <tr key={supportContol.Id}>
                    <td className="table-dark text-center">{new Date(supportContol.Date).toLocaleDateString()}</td>
                    <td className="table-dark text-center">{supportContol.Name}</td>
                    <td className="table-dark text-center">{supportContol.Amount}</td>
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
        <div className='col-md'>
          <div className='ms-3 me-3 d-flex flex-column'>
            <Observacoes />
            <button type="button" className="btn btn-success align-self-end" style={{width:'170px'}}>Salvar Observações</button>
          </div>
        </div>
      </div>
    </>
  )
}