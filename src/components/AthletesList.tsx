import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';
import { getAthletes } from '@/pages/api/athletes';

interface Athlete {
  id: number;
  nome: string;
  posicao: string;
  data_nascimento: string;
  clube_atual: string;
}

export default function AthletesList() {
  const [page, setPage] = useState(1);
  const { push } = useRouter();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [totalRow, setTotalRow] = useState();

  useEffect(() => {
    const fetchAthletesData = async () => {
      try {
        const athletesData = await getAthletes();
        setAthletes(athletesData.data);
        setTotalRow(athletesData.total);
        console.log(athletesData)
      } catch (error) {
        console.error('Error fetching athletes:', error);
      }
    };

    fetchAthletesData();
  }, []);

  const itemsPerPage = 10 ; 
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = athletes.slice(startIndex, endIndex);

  const handleChangePage = (event: any, newPage:number) => {
    setPage(newPage);
  };

  const handleEditAthlete = (id: number) => {
    push(`/secure/athletes/${id}/athleteRelationship`)
  }

  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center mb-3 m-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="table-dark" scope="col">NOME</th>
              <th className="table-dark" scope="col">POSIÇÃO</th>
              <th className="table-dark" scope="col">D.NASCIMENTO</th>
              <th className="table-dark" scope="col">CLUBE ATUAL</th>
              <th className="table-dark"></th>
            </tr>
          </thead>
          <tbody>
            {
              athletes.length > 0 ? ( // Verifica se athletes está definido e não vazio
                displayedData.map(athlete => (
                  <tr key={athlete.id}>
                    <td className="table-dark">{athlete.nome}</td>
                    <td className="table-dark">{athlete.posicao}</td>
                    <td className="table-dark">{new Date(athlete.data_nascimento).toLocaleDateString()}</td>
                    <td className="table-dark">{athlete.clube_atual}</td>
                    <td className="table-dark d-flex justify-content-evenly">
                      <FontAwesomeIcon icon={faTrashCan} size='2xl' style={{color: "#ff0000", cursor:'pointer'}}/>
                      <FontAwesomeIcon icon={faEye} size="2xl" style={{color: "#ffffff", cursor:'pointer'}} onClick={() => handleEditAthlete(athlete.id)}/>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="table-dark text-center">Lista de atletas vazia</td>
                </tr>
              )
            }
          </tbody>
        </table>
        {
          athletes.length > itemsPerPage &&
            <Pagination 
              className="pagination-bar"
              count={Math.ceil(athletes.length / itemsPerPage)}
              page={page}
              onChange={handleChangePage}
              variant="outlined"
              size="large"
            />
        }
      </div>
    </>
  );
}
