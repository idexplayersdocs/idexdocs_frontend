import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faX } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';
import { getAthletes } from '@/pages/api/athletes';
import data from '../../pages/api/mock-data/mock-data-clubs.json'
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

export default function ClubHistory() {
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
      <Subtitle subtitle='Clubes'/>
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
              <th className="table-dark text-center" scope="col">Clube</th>
              <th className="table-dark text-center" scope="col">De</th>
              <th className="table-dark text-center" scope="col">Até</th>
            </tr>
          </thead>
          <tbody>
            {
              displayedData.length > 0 ? (
                displayedData.map(competicao => (
                  <tr key={competicao.Id}>
                    <td className="table-dark text-center">{competicao.Clube}</td>
                    <td className="table-dark text-center">{competicao.De}</td>
                    <td className="table-dark text-center">{competicao.Ate}</td>
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
