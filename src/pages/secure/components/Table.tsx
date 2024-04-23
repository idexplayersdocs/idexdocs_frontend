import React, { useState } from 'react';
import { Pagination } from '@mui/material';
import data from '../../api/mock-data/mock-data.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

export default function Table() {
  const [page, setPage] = useState(1);
  const handleChangePage = (event: any, newPage:number) => {
    setPage(newPage);
  };

  const itemsPerPage = 10; 
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = data.slice(startIndex, endIndex);

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
              displayedData.map(item=> (
                <tr key={item.Id}>
                  <td className="table-dark">{item.Name}</td>
                  <td className="table-dark">{item.Position}</td>
                  <td className="table-dark">{new Date(item.DateOfBirth).toLocaleDateString()}</td>
                  <td className="table-dark">{item.CurrentClub}</td>
                  <td className="table-dark d-flex justify-content-evenly">
                  {/* <FontAwesomeIcon icon={faTrashCan} style={{color: "#ff0000",}} size='2xl'/> */}
                  <FontAwesomeIcon icon={faTrashCan} style={{color: "#ff0000",}} size='2xl'/>
                  <FontAwesomeIcon icon={faEye} size="2xl" style={{color: "#ffffff",}} />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <Pagination 
          className="pagination-bar"
          count={Math.ceil(data.length / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          size="large"
        />
      </div>
    </>
  );
}
