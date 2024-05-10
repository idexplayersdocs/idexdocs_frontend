import React, { useEffect, useRef, useState } from 'react';
import { Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faX } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';
import { getAthletes } from '@/pages/api/http-service/athletes';
import data from '../../pages/api/mock-data/mock-data-history-competitions.json'
import Title from '../Title';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';
import { getCompetitions } from '@/pages/api/http-service/competitions';

export default function HistoryCompetitions({closeModal, athleteId}: any) {
  const effectRan = useRef(false);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(1)
  const [competitions, setCompetitions] = useState<any>({
    nome: '',
    data_competicao: '',
    jogos_completos: '',
    jogos_parciais: '',
    minutagem: '',
    gols: ''
  });


  const handleCloseModal = () => {
    closeModal();
  };

  useEffect(() => {
    if (!effectRan.current) {
      const fetchAthletesData = async () => {
        try {
          const competitionList = await getCompetitions(athleteId);
          console.log(competitionList)
          setCompetitions(competitionList?.data);
          setTotalRow(competitionList?.total);

        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchAthletesData();
    }
  }, [athleteId]);

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
      <FontAwesomeIcon icon={faX} color='white' size='xl' style={{cursor: 'pointer'}} onClick={handleCloseModal}/>
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
              competitions.length > 0 ? (
                Array.isArray(competitions) && competitions.map((competicao, index: number) => (
                  <tr key={index}>
                    <td className="table-dark text-center">{competicao.nome}</td>
                    <td className="table-dark text-center">{competicao.JogosCompletos}</td>
                    <td className="table-dark text-center">{competicao.JogosParciais}</td>
                    <td className="table-dark text-center">{competicao.Minutagem}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="table-dark text-center">Não possui histórico</td>
                </tr>
              )
            }
          </tbody>
        </table>
        {
                totalRow > 7 &&
                <Pagination
                  className="pagination-bar"
                  count={Math.ceil(totalRow / 7)}
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
