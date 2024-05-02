import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faX } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';
import { getAthletes } from '@/pages/api/athletes';
import data from '../../pages/api/mock-data/mock-data-history-competitions.json'
import Title from '../Title';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';

interface Athlete {
  id: number;
  nome: string;
  posicao: string;
  data_nascimento: string;
  clube_atual: string;
}

export default function HistoryCompetitions() {
  const [page, setPage] = useState(1);

  const itemsPerPage = 6; 
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = data.slice(startIndex, endIndex);

  const handleChangePageCompetitions = (event: any, newPage:number) => {
    setPage(newPage);
  };

  return (
    <>
    <div className='d-flex justify-content-between'>
      <Subtitle subtitle='Competições'/>
      <FontAwesomeIcon icon={faX} color='white' size='xl' style={{cursor: 'pointer'}}/>
    </div>
    <hr />
    <div className='d-flex justify-content-end mb-3'>
      <AddButton />
    </div>
      <div className="d-flex flex-column align-items-center justify-content-center mb-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark text-center" scope="col">Competição</th>
              <th className="table-dark text-center" scope="col">Jogos Completos</th>
              <th className="table-dark text-center" scope="col">Jogos Parciais</th>
              <th className="table-dark text-center" scope="col">Minutagem</th>
            </tr>
          </thead>
          <tbody>
            {
              displayedData.length > 0 ? (
                displayedData.map(competicao => (
                  <tr key={competicao.Id}>
                    <td className="table-dark text-center">{competicao.Competicao}</td>
                    <td className="table-dark text-center">{competicao.JogosCompletos}</td>
                    <td className="table-dark text-center">{competicao.JogosParciais}</td>
                    <td className="table-dark text-center">{competicao.Minutagem}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="table-dark text-center">Carregando...</td>
                </tr>
              )
            }
          </tbody>
        </table>
        {
          data.length > itemsPerPage &&
            <Pagination 
              className="pagination-bar"
              count={Math.ceil(data.length / itemsPerPage)}
              page={page}
              onChange={handleChangePageCompetitions}
              variant="outlined"
              size="large"
            />
        }
      </div>
    </>
  );
}
