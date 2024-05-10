import React, { useEffect, useRef, useState } from 'react';
import { Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faX } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';
import { getAthletes } from '@/pages/api/http-service/athletes';
import data from '../../pages/api/mock-data/mock-data-lesoes.json'
import Title from '../Title';
import Subtitle from '../Subtitle';
import AddButton from '../AddButton';
import { getInjuries } from '@/pages/api/http-service/injuries';

interface Athlete {
  id: number;
  nome: string;
  posicao: string;
  data_nascimento: string;
  clube_atual: string;
}

export default function Injuries({closeModal, athleteId}: any) {
  const effectRan = useRef(false);

  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(1)
  const [injuries, setInjuries] = useState<any>({
    nome: '',
    data_inicio: '',
    data_fim: '',
  });

  useEffect(() => {
    if (!effectRan.current) {
      const fetchAthletesData = async () => {
        try {
          const injuriesList = await getInjuries(athleteId);
          console.log(injuriesList)
          setInjuries(injuriesList?.data);
          setTotalRow(injuriesList?.total);

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

  const handleCloseModal = () => {
    closeModal();
  };

  return (
    <>
    <div className='d-flex justify-content-between'>
      <Subtitle subtitle='Lesões'/>
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
              <th className="table-dark text-center" scope="col">Data</th>
              <th className="table-dark text-center" scope="col">Lesão</th>
              <th className="table-dark text-center" scope="col">Descrição</th>
            </tr>
          </thead>
          <tbody>
            {
              injuries.length > 0 ? (
                Array.isArray(injuries) && injuries.map((competicao, index: number) => (
                  <tr key={index}>
                    <td className="table-dark text-center">{competicao.nome}</td>
                    <td className="table-dark text-center">{competicao.data_inicio}</td>
                    <td className="table-dark text-center">{competicao.data_fim}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="table-dark text-center">Não possui Lesões</td>
                </tr>
              )
            }
          </tbody>
        </table>
        {
          totalRow > 6 &&
            <Pagination 
              className="pagination-bar"
              count={Math.ceil(totalRow / 6)}
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
