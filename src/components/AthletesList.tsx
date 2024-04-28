import React, { useState } from 'react';
import { Pagination } from '@mui/material';
import data from '../pages/api/mock-data/mock-data-athletes-list.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';

export default function AthletesList() {
  const [page, setPage] = useState(1);

  const { push } = useRouter();
  
  const itemsPerPage = 10; 
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = data.slice(startIndex, endIndex);

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
              displayedData.map(athlete => (
                <tr key={athlete.Id}>
                  <td className="table-dark">{athlete.Name}</td>
                  <td className="table-dark">{athlete.Position}</td>
                  <td className="table-dark">{new Date(athlete.DateOfBirth).toLocaleDateString()}</td>
                  <td className="table-dark">{athlete.CurrentClub}</td>
                  <td className="table-dark d-flex justify-content-evenly">
                  <FontAwesomeIcon icon={faTrashCan} size='2xl' style={{color: "#ff0000", cursor:'pointer'}}/>
                  <FontAwesomeIcon icon={faEye} size="2xl" style={{color: "#ffffff", cursor:'pointer'}} onClick={() => handleEditAthlete(athlete.Id)}/>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {
          data.length > itemsPerPage &&
            <Pagination 
              className="pagination-bar"
              count={Math.ceil(data.length / itemsPerPage)}
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
